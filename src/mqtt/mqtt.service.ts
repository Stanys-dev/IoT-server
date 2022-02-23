import { Injectable } from '@nestjs/common';
import mqtt from 'mqtt';
import unique_id from 'unique-id-key';
import cbor from 'cbor';
import { RecordsService } from '../records/records.service';

@Injectable()
export class MqttService {
  client: mqtt.MqttClient;

  constructor(private recordsService: RecordsService) {
    this.client = mqtt.connect('mqtt://test.mosquitto.org', {
      clean: false,
      clientId: unique_id.RandomString(11, 'uppercase'),
      protocol: 'mqtt',
      port: 1883,
      rejectUnauthorized: false,
    });

    this.client.on('message', async (topic: string, payload: any) => {
      await this.handleMessage(payload, topic);
    });

    this.client.on('connect', () => console.log('MQTT client connected'));

    this.client.on('disconnect', () => console.log('MQTT client disconnected'));

    this.client.on('error', (e) => console.error(e));

    this.client.on('close', () => console.log('MQTT client closed'));

    this.client.on('end', () => console.log('MQTT client ended'));

    this.client.on('reconnect', () => console.log('MQTT client reconnected'));

    this.client.on('offline', () => console.log('MQTT client offline'));

    this.client.on('outgoingEmpty', () =>
      console.log('MQTT client outgoingEmpty'),
    );

    this.client.subscribe('records');
  }

  async handleMessage(payload: any, topic: string) {
    console.log(this.decodePayload(payload));

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
    this.client.publish(topic, this.encodePayload(data), { qos: 1 });
  }
}
