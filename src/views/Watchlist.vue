<script lang="ts">
import { defineComponent } from "vue";

import store from "../store";
import Card from "../components/Card.vue";
import ErrorBanner from "../components/ErrorBanner.vue";
import Button from "../components/Button.vue";

/**
 *
 * @interface Stream
 * @property {string} isin - The ISIN code for a particular security.
 * @property {number} price - The current price of the security.
 * @property {'up' | 'down' | 'constant'} priceChange - The change in price compared to the previous value.
 * @property {number} bid - The current bid price for the security.
 * @property {'up' | 'down' | 'constant'} bidChange - The change in bid price compared to the previous value.
 * @property {number} ask - The current ask price for the security.
 * @property {'up' | 'down' | 'constant'} askChange - The change in ask price compared to the previous value.
 * @property {WebSocket} socket - The WebSocket instance associated with this stream.
 */
export interface Stream {
  isin: string;
  price: number;
  priceChange: "up" | "down" | "constant";
  bid: number;
  bidChange: "up" | "down" | "constant";
  ask: number;
  askChange: "up" | "down" | "constant";
  socket: WebSocket;
}

export default defineComponent({
  name: "Watchlist",
  emits: ["vnode-unmounted"],
  components: {
    Card,
    ErrorBanner,
    Button,
  },
  /**
   * @description The data property is an object that returns a JavaScript object literal with the following properties:
   * webSockets: An empty array of type WebSocket
   * streams: An empty array of type Stream
   * error: A boolean that is set to false
   * debounceTimeout: An undefined variable of type ReturnType<typeof setTimeout> | undefined
   */
  data: () => ({
    webSockets: [] as WebSocket[],
    streams: [] as Stream[],
    error: false as Boolean,
    debounceTimeout: undefined as ReturnType<typeof setTimeout> | undefined,
  }),
  /**
   * @description The computed property is an object that contains the following properties:
   * ISINs: A getter that returns the ISINs from the global store state.
   * list: A getter that returns an array of objects that describe the properties to be displayed for each Stream object in the streams array.
   */
  computed: {
    ISINs() {
      return store.state.ISINs;
    },
    list() {
      return [
        {
          id: "ISIN",
          key: "isin",
          title:
            "The 12-digit alphanumeric code that uniquely identifies a specific instrument",
        },
        { id: "Price", key: "price" },
        {
          id: "Bid",
          key: "bid",
          title:
            "The highest price a buyer will pay to buy a specified number of shares of an instrument at any given time.",
        },
        {
          id: "Ask",
          key: "ask",
          title: "The lowest price at which a seller will sell the instrument.",
        },
      ];
    },
  },
  methods: {
    /**
     * Function that updates the data received from the socket and updates the UI accordingly
     *
     * @params {Stream} data - Actual data returns after the firing message
     * @params {WebSocket} socket - The websocket itself
     *
     * @returns {Void}
     */
    onMessageUpdate(data: Stream, socket: WebSocket): void {
      const existed = this.streams.some((str) => str.isin === data.isin);

      if (existed) {
        this.debounceTimeout = setTimeout(() => {
          const newStream = this.streams.map((stream) => {
            if (stream.isin !== data.isin) return stream;
            else {
              if (stream.price < data.price) data.priceChange = "up";
              else if (stream.price > data.price) data.priceChange = "down";
              else data.priceChange = "constant";

              if (stream.bid < data.bid) data.bidChange = "up";
              else if (stream.bid > data.bid) data.bidChange = "down";
              else data.bidChange = "constant";

              if (stream.ask < data.ask) data.askChange = "up";
              else if (stream.ask > data.ask) data.askChange = "down";
              else data.askChange = "constant";

              return { ...data, socket };
            }
          });

          this.streams = newStream;
        }, 1000);
      } else this.streams.push({ ...data, socket });
    },
    /**
     * Handles the WebSocket connection for a specific ISIN
     *
     * @param {WebSocket} socket - The WebSocket instance
     * @param {String} ISIN - The ISIN identifier for the financial instrument
     *
     * @returns {void}
     */
    socketConnections(socket: WebSocket, ISIN: String): void {
      this.error = false;

      this.webSockets.push(socket);

      (socket.onopen = () => {
        const message = {
          subscribe: ISIN,
        };

        if (socket.bufferedAmount == 0) {
          socket.send(JSON.stringify(message));
        }
      })();

      socket.onmessage = (event) => {
        this.onMessageUpdate(JSON.parse(event.data), socket);
      };
    },

    /**
     * Unsubscribes a stream from the websocket connection.
     *
     * @param {Stream} stream - The stream to be unsubscribed.
     *
     * @returns {Void}
     */
    unsubscribe(stream: Stream): void {
      console.log("ok");
      const { socket, isin } = stream;

      (socket.onopen = () => {
        const message = {
          unsubscribe: isin,
        };

        if (socket.bufferedAmount == 0) {
          socket.send(JSON.stringify(message));

          this.streams = this.streams.filter((stream) => stream.isin !== isin);
          store.state.ISINs = store.state.ISINs.filter(
            (ISIN: string) => ISIN !== isin
          );
        }
      })();
    },
  },
  /**
   * @function
   * @description This function creates a WebSocket connection for each ISIN
   * in the `ISINs` array and calls the `socketConnections` function to handle
   * the connection and its events. If a WebSocket connection cannot be established,
   * it will keep trying until the connection is successful. If there is an error, the `error` property is set to `true`.
   * @fires {@link #socketConnections}
   *
   * @returns {void}
   */
  mounted(): void {
    this.ISINs.forEach((ISIN: string) => {
      const websocket = new WebSocket("ws://localhost:8425/");

      websocket.onerror = () => {
        this.error = true;
      };

      if (websocket.readyState === 1) {
        this.socketConnections(websocket, ISIN);
      } else {
        let interval = undefined as undefined | ReturnType<typeof setInterval>;

        const tryAgain = () => {
          if (websocket.readyState === 1) {
            this.socketConnections(websocket, ISIN);

            clearInterval(interval);
          } else this.error = true;
        };

        interval = setInterval(tryAgain, 100);
      }
    });
  },
  /**
   * @function
   * @description The beforeUpdate method of the Vue component clears the debounceTimeout setTimeout.
   *
   * @returns {void}
   */
  beforeUpdate(): void {
    clearTimeout(this.debounceTimeout);
  },
  /**
   * @function
   * @description Method to close web socket connections when the component is unmounted
   *
   * @returns {void}
   */
  unmounted(): void {
    this.webSockets.forEach((socket) => socket.close());
  },
});
</script>

<template>
  <h1 class="heading1">List of watched ISIN</h1>
  <p class="p1" v-if="!ISINs.length">There is nothing on the watchlist yet!</p>
  <div class="container__data" v-else>
    <ErrorBanner v-if="error"
      >There is a problem connecting to the WebSocket; the data may be old or
      not showing correctly.</ErrorBanner
    >
    <!-- 
      This is a Vue component that renders a card for each element in the 
      "streams" array. The card contains a "Unsubscribe" button and a list 
      of values for each stream, including ISIN code, price, bid, ask, and 
      the change of each value (up, down, or constant). The button triggers 
      the "unsubscribe" method and passes the current "stream" as an argument 
      when it is clicked. The values for each stream are dynamically rendered 
      using Vue directives. The "list" array defines the properties of each 
      value to be displayed, and each list item is bound to a specific "li" 
      in the "list" array.
     -->
    <Card v-for="stream in streams" :key="stream">
      <Button
        class="action__unsubscribe"
        type="delete"
        @click.once="unsubscribe(stream)"
        >Unsubscribe</Button
      >
      <ul class="container__list" role="list" aria-label="List of ISIN values">
        <li
          class="list__item"
          v-for="li in list"
          :key="li.id"
          :title="li.title"
          role="listitem"
          :aria-label="li.id"
        >
          <span class="font__bold item__detail--label">{{ li.id }}:</span>
          <span :class="stream.priceChange">{{ stream[li.key] }}</span>
        </li>
      </ul>
    </Card>
  </div>
</template>

<style lang="scss">
:root {
  --min-width-label: 40px;
}

.container__data {
  @include flex($dir: column, $gap: var(--space-16));

  .action__unsubscribe {
    position: absolute;
    right: 1%;

    cursor: pointer;
  }

  .container__list {
    list-style: none;

    padding: 0 var(--space-16);

    .list__item {
      @include flex($gap: var(--space-12));

      &:not(:first-child) {
        .up {
          color: var(--color-primary-green4);
        }

        .down {
          color: var(--color-primary-red4);
        }
      }

      & .item__detail--label {
        display: inline-block;

        min-width: var(--min-width-label);
      }
    }
  }
}
</style>
