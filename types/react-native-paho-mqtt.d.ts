/**
 * TypeScript definitions for react-native-paho-mqtt
 * Based on version 0.1.1
 */

declare module 'react-native-paho-mqtt' {
  import { EventEmitter } from 'events';

  // ============================================================================
  // Message Class
  // ============================================================================

  export class Message {
    /**
     * The payload as a string if the payload consists of valid UTF-8 characters.
     * @readonly
     */
    readonly payloadString: string;

    /**
     * The payload as an ArrayBuffer.
     * @readonly
     */
    readonly payloadBytes: Uint8Array;

    /**
     * The name of the destination to which the message is to be sent
     * (for messages about to be sent) or the name of the destination from which the message has been received.
     * (for messages received by the onMessage function).
     * @mandatory
     */
    destinationName: string;

    /**
     * The Quality of Service used to deliver the message.
     * - 0: Best effort (default)
     * - 1: At least once
     * - 2: Exactly once
     */
    qos: 0 | 1 | 2;

    /**
     * If true, the message is to be retained by the server and delivered
     * to both current and future subscriptions.
     * If false the server only delivers the message to current subscribers, this is the default for new Messages.
     * A received message has the retained boolean set to true if the message was published
     * with the retained boolean set to true and the subscription was made after the message has been published.
     */
    retained: boolean;

    /**
     * If true, this message might be a duplicate of one which has already been received.
     * This is only set on messages received from the server.
     * @readonly
     */
    readonly duplicate: boolean;

    /**
     * @param newPayload The message data to be sent.
     */
    constructor(newPayload: string | Uint8Array);
  }

  // ============================================================================
  // Client Class
  // ============================================================================

  export interface ConstructorOptions {
    /** The address of the messaging server, as a fully qualified WebSocket URI */
    uri: string;
    /** The Messaging client identifier, between 1 and 23 characters in length */
    clientId: string;
    /** Object implementing getItem, setItem, removeItem in a manner compatible with localStorage */
    storage?: any;
    /** Object implementing the W3C websocket spec */
    webSocket?: any;
  }

  export interface ConnectOptions {
    /** Authentication username for this connection */
    userName?: string;
    /** Authentication password for this connection */
    password?: string;
    /** Sent by the server when the client disconnects abnormally */
    willMessage?: Message;
    /** Fail if not connected within this time (default: 30000) */
    timeout?: number;
    /** Ping the server every n ms to avoid being disconnected by the remote end (default: 60) */
    keepAliveInterval?: number;
    /** If true the client and server persistent state is deleted on successful connect (default: true) */
    cleanSession?: boolean;
    /** Protocol version to use (3 or 4, default: 4) */
    mqttVersion?: number;
    /** Allow MQTT version fallback */
    allowMqttVersionFallback?: boolean;
    /** Alternative URIs */
    uris?: string[];
  }

  export interface SubscribeOptions {
    /** The maximum qos of any publications sent as a result of making this subscription (default: 0) */
    qos?: 0 | 1 | 2;
    /** Milliseconds after which the call will fail (default: 30000) */
    timeout?: number;
  }

  export interface UnsubscribeOptions {
    /** Milliseconds after which the call will fail (default: 30000) */
    timeout?: number;
  }

  /**
   * The JavaScript application communicates to the server using a Client object.
   * 
   * Most applications will create just one Client object and then call its connect() method,
   * however applications can create more than one Client object if they wish.
   * In this case the combination of uri and clientId attributes must be different for each Client object.
   * 
   * @fires Client#connectionLost
   * @fires Client#messageReceived
   * @fires Client#messageDelivered
   */
  export class Client extends EventEmitter {
    /**
     * @param options Constructor options
     */
    constructor(options: ConstructorOptions);

    /**
     * Connect this Messaging client to its server.
     * 
     * @param options Connection options
     * @returns Promise that resolves when connected
     */
    connect(options?: ConnectOptions): Promise<void>;

    /**
     * Subscribe for messages, request receipt of a copy of messages sent to the destinations described by the filter.
     * 
     * @param filter The topic to subscribe to
     * @param options Subscription options
     * @returns Promise that resolves when subscription is successful
     */
    subscribe(filter: string, options?: SubscribeOptions): Promise<void>;

    /**
     * Unsubscribe for messages, stop receiving messages sent to destinations described by the filter.
     * 
     * @param filter The topic to unsubscribe from
     * @param options Unsubscribe options
     * @returns Promise that resolves when unsubscription is successful
     */
    unsubscribe(filter: string, options?: UnsubscribeOptions): Promise<void>;

    /**
     * Send a message to the consumers of the destination in the Message.
     * 
     * @param topic The name of the destination to which the message is to be sent, or a Message object
     * @param payload The message data to be sent (required if topic is string)
     * @param qos The Quality of Service used to deliver the message (required if topic is string)
     * @param retained If true, the message is to be retained by the server (required if topic is string)
     * @throws {InvalidState} if the client is not connected
     */
    send(topic: Message): void;
    send(topic: string, payload: string, qos?: 0 | 1 | 2, retained?: boolean): void;

    /**
     * Normal disconnect of this Messaging client from its server.
     * 
     * @returns Promise that resolves when disconnected
     * @throws {InvalidState} if the client is already disconnected
     */
    disconnect(): Promise<void>;

    /**
     * Get the contents of the trace log.
     * 
     * @returns Trace buffer containing the time ordered trace records
     */
    getTraceLog(): any[];

    /**
     * Start tracing.
     */
    startTrace(): void;

    /**
     * Stop tracing.
     */
    stopTrace(): void;

    /**
     * Check if the client is connected.
     * 
     * @returns True if connected, false otherwise
     */
    isConnected(): boolean;

    /**
     * Get the URI of the client.
     * @readonly
     */
    readonly uri: string;

    /**
     * Get the client ID.
     * @readonly
     */
    readonly clientId: string | null;

    /**
     * Get or set the trace function.
     */
    trace: ((...args: any[]) => void) | null;

    // Event handlers
    on(event: 'connectionLost', listener: (error: any) => void): this;
    on(event: 'messageReceived', listener: (message: Message) => void): this;
    on(event: 'messageDelivered', listener: (message: Message) => void): this;
    on(event: string, listener: (...args: any[]) => void): this;

    once(event: 'connectionLost', listener: (error: any) => void): this;
    once(event: 'messageReceived', listener: (message: Message) => void): this;
    once(event: 'messageDelivered', listener: (message: Message) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;

    off(event: 'connectionLost', listener: (error: any) => void): this;
    off(event: 'messageReceived', listener: (message: Message) => void): this;
    off(event: 'messageDelivered', listener: (message: Message) => void): this;
    off(event: string, listener: (...args: any[]) => void): this;

    emit(event: 'connectionLost', error: any): boolean;
    emit(event: 'messageReceived', message: Message): boolean;
    emit(event: 'messageDelivered', message: Message): boolean;
    emit(event: string, ...args: any[]): boolean;
  }

  // ============================================================================
  // Constants
  // ============================================================================

  export const DEFAULT_KEEPALIVE_SECONDS: number;

  export const ERROR: {
    INVALID_ARGUMENT: string;
    INVALID_TYPE: string;
    INVALID_STATE: string;
    [key: string]: string;
  };

  // ============================================================================
  // Utility Functions
  // ============================================================================

  export function format(template: string, args: any[]): string;
  export function validate(obj: any, schema: any): void;
  export function lengthOfUTF8(str: string): number;
  export function parseUTF8(buffer: Uint8Array, offset: number, length: number): string;
  export function stringToUTF8(str: string, buffer: Uint8Array, offset: number): void;
} 