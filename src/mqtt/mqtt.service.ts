import { Injectable } from '@nestjs/common';
import mqtt from 'mqtt';
import unique_id from 'unique-id-key';
import cbor from 'cbor';
import { RecordsService } from '../records/records.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MqttService {
  mqttClient: mqtt.MqttClient;
  configService = new ConfigService();

  constructor(private recordsService: RecordsService) {
    this.mqttClient = mqtt.connect(this.configService.get('MQTT_URL'), {
      clean: false,
      clientId: unique_id.RandomString(11, 'uppercase'),
      protocol: 'mqtt',
      port: 1883,
      username: this.configService.get('MQTT_USERNAME'),
      password: this.configService.get('MQTT_PASSWORD'),
    });

    this.mqttClient.on('message', async (topic: string, payload: any) => {
      await this.handleMessage(payload, topic);
    });

    this.mqttClient.on('connect', () => console.log('MQTT client connected'));

    this.mqttClient.on('disconnect', () =>
      console.log('MQTT client disconnected'),
    );

    this.mqttClient.on('error', (e) => console.error(e));

    this.mqttClient.on('close', () => console.log('MQTT client closed'));

    this.mqttClient.on('end', () => console.log('MQTT client ended'));

    this.mqttClient.on('reconnect', () =>
      console.log('MQTT client reconnected'),
    );

    this.mqttClient.on('offline', () => console.log('MQTT client offline'));

    this.mqttClient.on('outgoingEmpty', () =>
      console.log('MQTT client outgoingEmpty'),
    );

    this.mqttClient.subscribe('records');
  }

  async handleMessage(payload: any, topic: string) {
    let response = await this.topicsHandler(topic, this.decodePayload(payload));

    if (!response) return;

    response = JSON.parse(JSON.stringify(response));

    this.publishMessage(topic, response);
  }

  encodePayload(payload: any) {
    return payload
      ? Buffer.from(cbor.encode(payload).toString('hex'), 'hex')
      : Buffer.alloc(0);
  }

  decodePayload(payload: any) {
    const buffer =
      payload instanceof Buffer ? payload : Buffer.from(payload, 'hex');
    try {
      return cbor.decodeFirstSync(buffer);
    } catch (e) {
      console.log(buffer, buffer instanceof Buffer);
      throw e;
    }
  }

  async topicsHandler(topic: string, data: any) {
    // This check is required when device and server are using the same MQTT broker to avoid error about duplicated _id
    if (data._id) return;

    const handlers = {
      records: this.recordsService.saveRecords(data),
    };

    return handlers[topic];
  }

  publishMessage(topic, data) {
    this.mqttClient.publish(topic, this.encodePayload(data), { qos: 1 });
  }
}
