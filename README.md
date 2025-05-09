# 🌡️ Monitoramento e Controle de Temperatura com ESP32 e MQTT

Projeto desenvolvido para a disciplina de Instrumentação Industrial da Universidade Federal de Alfenas – Campus Poços de Caldas.

## 📚 Descrição

Este projeto tem como objetivo controlar a temperatura de um ambiente utilizando sensores e atuadores conectados a um ESP32, com visualização em tempo real dos dados via interface web e armazenamento histórico em banco de dados.

Inicialmente implementado com Arduino, evoluímos para uma solução mais robusta com ESP32 e MQTT, possibilitando controle remoto e monitoramento eficiente mesmo em regiões com alta variação térmica.

## ⚙️ Funcionalidades

- Leitura de temperatura e umidade via DHT11
- Controle de ventilador com lógica de histerese (liga/desliga com base em temperaturas configuráveis)
- Visualização em display LCD I2C 128x64
- Configuração dinâmica das temperaturas via botões físicos
- Envio de dados via MQTT (Mosquitto) para servidor Ubuntu
- Integração com ESPHome para monitoramento remoto
- Armazenamento dos dados no Supabase via Node.js
- Interface web em tempo real com WebSocket e gráficos

## 🔌 Configuração na Protoboard

| Componente            | Pino no ESP32 |
|-----------------------|---------------|
| **I2C SDA (LCD)**     | GPIO 21       |
| **I2C SCL (LCD)**     | GPIO 22       |
| **Sensor DHT11**      | GPIO 19       |
| **Relé (ventilador)** | GPIO 23       |
| **Botão Aumentar**    | GPIO 15       |
| **Botão Diminuir**    | GPIO 4        |
| **Botão Modo**        | GPIO 2        |

O botão "Modo" permite alternar entre os modos de configuração:
- Temperatura para ligar o ventilador
- Temperatura para desligar o ventilador
- Visualização da temperatura atual

## 🧩 Tecnologias Utilizadas

- **Hardware:** ESP32, DHT11, LCD I2C 128x64, Módulo Relé, Botões
- **Firmware:** [ESPHome](https://esphome.io/)
- **Servidor MQTT:** Mosquitto
- **Backend:** Node.js, PM2
- **Banco de Dados:** [Supabase](https://supabase.com/)
- **Frontend:** HTML, JavaScript (WebSockets + Charts)

## 🌐 Interface Web

A interface web exibe em tempo real:
- Temperatura atual (°C)
- Umidade relativa (%)
- Status do ventilador (Ligado/Desligado)

##
##
##


## 🚀 Como Executar

1. **ESP32 com ESPHome**
   - Configure o `secrets.yaml` conforme suas credenciais.
   - Suba a configuração no dispositivo via `esphome`.

2. **Servidor MQTT (Ubuntu)**
   - Instale e configure o Mosquitto.
   - Garanta que o ESP32 esteja conectado e publicando os dados.

3. **Backend Node.js**
   - Configure as variáveis no arquivo `.env` (veja `example.env` se aplicável).
   - Execute com PM2:
     ```bash
     pm2 start index.js
     ```

4. **Frontend**
   - **Importante:** Antes de abrir o `index.html`, edite o arquivo e configure suas credenciais de acesso ao broker MQTT e Supabase:
     ```js
     const client = mqtt.connect('URL_MQTT', {
         username: 'USER_MQTT',
         password: 'PASS_MQTT'
     });

     const supabase = window.supabase.createClient(
         'https://URLSUPABASE.supabase.co',
         'SUA_CHAVE_SUPABASE'
     );
     ```
   - Após configurar, abra o arquivo `index.html` em seu navegador.
   - Os dados serão exibidos em tempo real via WebSocket e gráficos.


## 📊 Exemplo de Gráfico

A interface web exibe temperatura, umidade e status do ventilador com gráficos dinâmicos atualizados em tempo real.

## 👥 Autores

- Nickolas Mariano dos Santos – [@nicknickolasm4](https://github.com/nicknickolasm4) [@nickamarianoo](https://github.com/nickamarianoo)
- Isabelle Marcelino Rodrigues – [@Isah.Rodrigues08](https://www.instagram.com/isah.rodrigues08)
- Mayumi Sakete Carvalho Tomaz  – [@mayumitomaz](https://www.instagram.com/mayumitomaz/)

---

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📝 Licença

Este projeto é Livre!!


