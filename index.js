const mqtt = require('mqtt');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config()

// Dados do MQTT
const mqttOptions = {
  username: process.env.USERMQTT,
  password: process.env.PASSMQTT,
};

const mqttClient = mqtt.connect(process.env.MQTT_HOST, mqttOptions);

// Supabase
const supabase = createClient(process.env.URLSUPABASE, KEY_SUPABASE);

// Tópicos
const topicos = {
  temperatura: 'esp32_temperatura/sensor/temperatura_sala/state',
  umidade: 'esp32_temperatura/sensor/umidade_sala/state',
  rele: 'esp32_temperatura/switch/rele/state',
};

// Variáveis temporárias para armazenar dados recebidos
let ultimoValor = {
  temperatura: 0,
  umidade: 0,
  rele: 0,
};
console.log(ultimoValor)
mqttClient.on('connect', () => {
  console.log('Conectado ao MQTT');

  // Assina os tópicos
  mqttClient.subscribe(Object.values(topicos), (err) => {
    if (err) console.error('Erro ao se inscrever:', err);
  });
});

mqttClient.on('message', async (topic, message) => {
  const valor = parseFloat(message.toString());

  if (topic === topicos.temperatura) {
    ultimoValor.temperatura = valor;
  } else if (topic === topicos.umidade) {
    ultimoValor.umidade = valor;
  } else if (topic === topicos.rele) {
    ultimoValor.rele = valor ? valor : 0;
  }

  // Se já recebeu os dois valores, verifica tempo e insere se necessário
  if (ultimoValor.temperatura !== null && ultimoValor.umidade !== null  && ultimoValor.rele !== null) {
    const { data, error } = await supabase
      .from(process.env.BANCO_DE_DADOS)
      .select('created_at')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erro ao buscar último registro:', error);
      return;
    }

    const agora = new Date();
    const ultimoRegistro = data[0] ? new Date(data[0].created_at) : null;
    const minutosPassados = ultimoRegistro ? (agora - ultimoRegistro) / 60000 : Infinity;
    console.log(ultimoValor)
    if (minutosPassados >= 15) {
      const { error: insertError } = await supabase
        .from(process.env.BANCO_DE_DADOS)
        .insert([
          {
            temperatura: ultimoValor.temperatura,
            umidade: ultimoValor.umidade,
            status: ultimoValor.rele,
            created_at: agora.toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Erro ao inserir no Supabase:', insertError);
      } else {
        console.log(`Dados inseridos: temperatura=${ultimoValor.temperatura}, umidade=${ultimoValor.umidade}, rele=${ultimoValor.rele}`);
        // Limpa para aguardar novos dados
        ultimoValor = { temperatura: null, umidade: null, rele: null };
      }
    } else {
      console.log(`Ignorado: último envio há ${minutosPassados.toFixed(2)} minutos`);
    }
  }
});
