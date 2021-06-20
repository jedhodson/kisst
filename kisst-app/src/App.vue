<template>
  <div class="min-h-screen bg-gray-100">
    <Popover as="header" class="pb-24 bg-indigo-600" v-slot="{ open }">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div
          class="
            relative
            py-5
            flex
            items-center
            justify-center
            lg:justify-between
          "
        >
          <!-- Logo -->
          <div class="absolute left-0 flex-shrink-0 lg:static">
            <h2
              class="
                text-2xl
                font-bold
                leading-7
                text-white
                sm:text-3xl
                sm:truncate
                py-6
              "
            >
              Stupidly Simple Stocktake
            </h2>
          </div>
        </div>
      </div>

      <TransitionRoot as="template" :show="open">
        <div class="lg:hidden">
          <TransitionChild
            as="template"
            enter="duration-150 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-150 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <PopoverOverlay
              static
              class="z-20 fixed inset-0 bg-black bg-opacity-25"
            />
          </TransitionChild>
        </div>
      </TransitionRoot>
    </Popover>
    <main class="-mt-24 pb-8">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 class="sr-only">Page title</h1>
        <!-- Main 3 column grid -->
        <div class="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
          <!-- Right column -->
          <div class="grid grid-cols-1 gap-4">
            <section aria-labelledby="section-2-title">
              <h2 class="sr-only" id="section-2-title">Section title</h2>
              <div class="rounded-lg bg-white overflow-hidden shadow">
                <div class="p-6">
                  <span
                    class="
                      inline-flex
                      items-center
                      px-2.5
                      py-0.5
                      rounded-md
                      text-sm
                      font-medium
                    "
                    :class="serverStatus.color"
                  >
                    {{ serverStatus.text }}
                  </span>
                  <span
                    class="
                      inline-flex
                      items-center
                      px-2.5
                      py-0.5
                      mx-1
                      rounded-md
                      text-sm
                      font-medium
                      bg-gray-100 text-gray-600
                    "
                  >
                    {{ database }}
                  </span>
                  <div class="flex flex-col gap-2">
                    <div class="mt-1 relative">
                      <input
                        type="text"
                        name="location"
                        class="
                          shadow-sm
                          focus:ring-indigo-500
                          focus:border-indigo-500
                          block
                          w-full
                          h-16
                          text-xl
                          border-gray-300
                          rounded-md
                        "
                        placeholder="LOCATION"
                        v-model="newItem.location"
                        autocomplete="off"
                        tabindex="1"
                        ref="locationInput"
                        autofocus
                        :disabled="locationLock"
                      />
                      <div
                        class="
                          absolute
                          inset-y-0
                          right-0
                          pr-5
                          flex
                          items-center
                        "
                      >
                        <LockClosedIcon
                          class="h-7 w-7 text-gray-400"
                          :class="{ hidden: !locationLock }"
                          @click="locationLock = !locationLock"
                          aria-hidden="true"
                        />
                        <LockOpenIcon
                          class="h-7 w-7 text-gray-400"
                          :class="{ hidden: locationLock }"
                          @click="locationLock = !locationLock"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div class="mt-1">
                      <input
                        type="text"
                        name="barcode"
                        class="
                          shadow-sm
                          focus:ring-indigo-500
                          focus:border-indigo-500
                          block
                          w-full
                          h-16
                          text-xl
                          border-gray-300
                          rounded-md
                        "
                        placeholder="BARCODE"
                        v-model="newItem.barcode"
                        autocomplete="off"
                        tabindex="2"
                        ref="barcodeInput"
                      />
                    </div>
                    <div class="mt-1">
                      <input
                        type="text"
                        name="quantity"
                        class="
                          shadow-sm
                          focus:ring-indigo-500
                          focus:border-indigo-500
                          block
                          w-full
                          h-16
                          text-xl
                          border-gray-300
                          rounded-md
                        "
                        placeholder="QTY"
                        v-model="newItem.qty"
                        autocomplete="off"
                        tabindex="3"
                        ref="qtyInput"
                      />
                    </div>

                    <button
                      type="button"
                      class="
                        inline-flex
                        items-center
                        px-6
                        py-3
                        border border-transparent
                        text-base
                        font-medium
                        rounded-md
                        shadow-sm
                        text-white
                        bg-indigo-600
                        hover:bg-indigo-700
                        focus:outline-none
                        focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                        disabled:opacity-50
                      "
                      :disabled="!interactEnable"
                      @click="submit"
                      tabindex="4"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
          <!-- Left column -->
          <div class="grid grid-cols-1 gap-4 lg:col-span-2">
            <section aria-labelledby="section-1-title">
              <div class="rounded-lg bg-white overflow-hidden shadow">
                <div class="p-0">
                  <div class="flex flex-col">
                    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div
                        class="
                          py-2
                          align-middle
                          inline-block
                          min-w-full
                          sm:px-6
                          lg:px-8
                        "
                      >
                        <div
                          class="
                            shadow
                            overflow-hidden
                            border-b border-gray-200
                            sm:rounded-lg
                          "
                        >
                          <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  class="
                                    px-6
                                    py-3
                                    text-left text-xs
                                    font-medium
                                    text-gray-500
                                    uppercase
                                    tracking-wider
                                  "
                                >
                                  ID
                                </th>

                                <th
                                  scope="col"
                                  class="
                                    px-6
                                    py-3
                                    text-left text-xs
                                    font-medium
                                    text-gray-500
                                    uppercase
                                    tracking-wider
                                  "
                                >
                                  Location
                                </th>

                                <th
                                  scope="col"
                                  class="
                                    px-6
                                    py-3
                                    text-left text-xs
                                    font-medium
                                    text-gray-500
                                    uppercase
                                    tracking-wider
                                  "
                                >
                                  Barcode
                                </th>

                                <th
                                  scope="col"
                                  class="
                                    px-6
                                    py-3
                                    text-left text-xs
                                    font-medium
                                    text-gray-500
                                    uppercase
                                    tracking-wider
                                  "
                                >
                                  Quantity
                                </th>

                                <th scope="col" class="relative px-1 py-3">
                                  <span class="sr-only">Edit</span>
                                </th>
                                <th scope="col" class="relative px-1 py-3">
                                  <span class="sr-only">Delete</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(item, itemIdx) in inventory"
                                :key="item.id"
                                :class="
                                  itemIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                "
                              >
                                <td
                                  class="
                                    px-6
                                    py-4
                                    whitespace-nowrap
                                    text-sm
                                    font-medium
                                    text-gray-900
                                  "
                                >
                                  {{ item.id }}
                                </td>

                                <td
                                  class="
                                    px-6
                                    py-4
                                    whitespace-nowrap
                                    text-sm text-gray-900
                                  "
                                >
                                  {{ item.location }}
                                </td>

                                <td
                                  class="
                                    px-6
                                    py-4
                                    whitespace-nowrap
                                    text-sm text-gray-900
                                  "
                                >
                                  {{ item.barcode }}
                                </td>

                                <td
                                  class="
                                    px-6
                                    py-4
                                    whitespace-nowrap
                                    text-sm text-gray-900
                                  "
                                >
                                  {{ item.qty }}
                                </td>

                                <td
                                  class="
                                    px-1
                                    py-4
                                    whitespace-nowrap
                                    text-center text-sm
                                    font-medium
                                  "
                                >
                                  <button
                                    href="#"
                                    class="
                                      text-indigo-600
                                      hover:text-indigo-900
                                      disabled:opacity-50
                                    "
                                    @click="editRow(item)"
                                    :disabled="!interactEnable"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                      />
                                    </svg>
                                  </button>
                                </td>

                                <td
                                  class="
                                    px-1
                                    py-4
                                    whitespace-nowrap
                                    text-center text-sm
                                    font-medium
                                  "
                                >
                                  <button
                                    href="#"
                                    class="
                                      text-indigo-600
                                      hover:text-indigo-900
                                      disabled:opacity-50
                                    "
                                    @click="deleteRow(item.id)"
                                    :disabled="!interactEnable"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      class="h-5 w-5"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
    <footer>
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
        <div
          class="
            border-t border-gray-200
            py-8
            text-sm text-gray-500 text-center
            sm:text-left
          "
        >
          <span>{{ debugInfo }}. DB: {{ database }}</span
          ><br />
          <span class="block sm:inline"
            >&copy; 2021 Scatter Labs Pty Ltd.
          </span>
          <span class="block sm:inline">All rights reserved.</span>
        </div>
      </div>
    </footer>
  </div>

  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      static
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="open = false"
      :open="open"
    >
      <div
        class="
          flex
          items-end
          justify-center
          min-h-screen
          pt-4
          px-4
          pb-20
          text-center
          sm:block
          sm:p-0
        "
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="
              inline-block
              align-bottom
              bg-white
              rounded-lg
              px-4
              pt-5
              pb-4
              text-left
              overflow-hidden
              shadow-xl
              transform
              transition-all
              sm:my-8
              sm:align-middle
              sm:max-w-lg
              sm:w-full
              sm:p-6
            "
          >
            <div>
              <div
                class="
                  mx-auto
                  flex
                  items-center
                  justify-center
                  h-12
                  w-12
                  rounded-full
                  bg-green-100
                "
              >
                <PencilIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
              <div class="mt-3 text-center sm:mt-5">
                <DialogTitle
                  as="h3"
                  class="text-lg leading-6 font-medium text-gray-900"
                >
                  Edit Row {{ editItem.id }}
                </DialogTitle>
                <div class="mt-2">
                  <div class="text-sm text-gray-500 grid grid-cols-1 gap-1">
                    <input
                        type="text"
                        name="location"
                        class="
                          shadow-sm
                          focus:ring-indigo-500
                          focus:border-indigo-500
                          block
                          w-full
                          border-gray-300
                          rounded-md
                        "
                        :placeholder="inventory[editItem.id].location"
                        v-model="editItem.location"
                        autocomplete="off"
                        tabindex="1"
                      />
                      <input
                        type="text"
                        name="location"
                        class="
                          shadow-sm
                          focus:ring-indigo-500
                          focus:border-indigo-500
                          block
                          w-full
                          border-gray-300
                          rounded-md
                        "
                        :placeholder="inventory[editItem.id].barcode"
                        v-model="editItem.barcode"
                        autocomplete="off"
                        tabindex="1"
                      />
                      <input
                        type="text"
                        name="location"
                        class="
                          shadow-sm
                          focus:ring-indigo-500
                          focus:border-indigo-500
                          block
                          w-full
                          border-gray-300
                          rounded-md
                        "
                        :placeholder="inventory[editItem.id].qty"
                        v-model="editItem.qty"
                        autocomplete="off"
                        tabindex="1"
                      />
                  </div>
                </div>
              </div>
            </div>
            <div
              class="
                mt-5
                sm:mt-6
                sm:grid sm:grid-cols-2
                sm:gap-3
                sm:grid-flow-row-dense
              "
            >
              <button
                type="button"
                class="
                  w-full
                  inline-flex
                  justify-center
                  rounded-md
                  border border-transparent
                  shadow-sm
                  px-4
                  py-2
                  bg-indigo-600
                  text-base
                  font-medium
                  text-white
                  hover:bg-indigo-700
                  focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  sm:col-start-2
                  sm:text-sm
                  disabled:opacity-50
                "
                @click="applyEdit()"
                :disabled="!interactEnable"
              >
                Submit
              </button>
              <button
                type="button"
                class="
                  mt-3
                  w-full
                  inline-flex
                  justify-center
                  rounded-md
                  border border-gray-300
                  shadow-sm
                  px-4
                  py-2
                  bg-white
                  text-base
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  focus:outline-none
                  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  sm:mt-0
                  sm:col-start-1
                  sm:text-sm
                "
                @click="open = false"
                ref="cancelButtonRef"
              >
                Cancel
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverOverlay,
  PopoverPanel,
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { BellIcon, MenuIcon, XIcon, CheckIcon,PencilIcon } from "@heroicons/vue/outline";
import {
  SearchIcon,
  MailIcon,
  LockClosedIcon,
  LockOpenIcon,
} from "@heroicons/vue/solid";

import host from "./host.js";

var newItem = {
  barcode: "",
  location: "",
  qty: "",
};

var editItemClear = {
  id: null,
  location: null,
  barcode: null,
  qty: null
};

const badgeColors = {
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-800",
  yellow: "bg-yellow-100 text-yellow-800",
};

export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Popover,
    PopoverButton,
    PopoverOverlay,
    PopoverPanel,
    TransitionChild,
    TransitionRoot,
    CheckIcon,
    LockClosedIcon,
    LockOpenIcon,
    MailIcon,
    PencilIcon,
    BellIcon,
    MenuIcon,
    SearchIcon,
    Dialog,
    DialogOverlay,
    DialogTitle,
    XIcon,
  },
  setup() {
    return {};
  },
  data() {
    return {
      newItem: newItem,
      serverStatus: {
        color: badgeColors.yellow,
        text: "CONNECTING",
      },
      inventory: [],
      interactEnable: false,
      locationLock: false,
      debugInfo: "",
      database: "default",
      open: false,
      editItem: editItemClear
    };
  },
  created() {
    this.initWS();
    setTimeout(() => {
      this.focusTests();
      this.database = this.$route.params.db || "default";
    }, 100); /** @todo this super hack */
  },
  methods: {
    initWS() {
      let wsHost = `ws://${host.baseUrl}:${host.port}/`;
      this.ws = new WebSocket(wsHost);
      this.ws.addEventListener("close", this.wsClosedHandler);
      this.ws.addEventListener("open", this.wsOpenHandler);
      this.ws.addEventListener("message", this.wsMessageHandler);
      this.ws.addEventListener("error", (err) => {
        console.log("WS Error:", err);
        //this.retryWS();
      });
      this.debugInfo = `KISST Server: ${wsHost}`;

      this.serverStatus = {
        color: badgeColors.yellow,
        text: "CONNECTING",
      };
    },
    retryWS() {
      console.log("Retrying connection to server");
      setTimeout(() => this.initWS(), 1000);
    },
    wsClosedHandler(event) {
      console.log("WS CLOSED");
      this.serverStatus = {
        color: badgeColors.red,
        text: "DISCONNECTED",
      };
      this.interactEnable = false;

      this.retryWS();
    },
    wsOpenHandler(event) {
      this.serverStatus = {
        color: badgeColors.green,
        text: "CONNECTED",
      };

      this.interactEnable = true;

      this.ws.send(JSON.stringify({
        action: 'REFRESH'
      }))
    },
    wsMessageHandler(payload) {
      let data = JSON.parse(payload.data);
      console.log("Received new message from server:", data);

      if(data.database[this.database] != undefined) this.inventory = Object.assign({}, data.database[this.database].data);
      else this.inventory = [];
    },
    deleteRow(id) {
      console.log("Deleting", id);
      this.ws.send(
        JSON.stringify({
          action: "REMOVE",
          db: this.database,
          data: {
            id: id,
          },
        })
      );
    },
    editRow(row) {
      console.log(row)
      this.editItem = Object.assign({}, row);
      this.open = true;
    },
    applyEdit() {
      this.open = false; 
      console.log(this.editItem);

      this.ws.send(
        JSON.stringify({
          action: 'EDIT',
          db: this.database,
          data: this.editItem
        })
      );
    },
    submit() {
      if (this.newItem.barcode == "" || this.newItem.location == "") return;

      this.ws.send(
        JSON.stringify({
          action: "ADD",
          db: this.database,
          data: newItem,
        })
      );

      // Clear input
      this.newItem.barcode = "";
      if (!this.locationLock) this.newItem.location = "";
      this.newItem.qty = "";

      if (this.locationLock) this.$refs.barcodeInput.focus();
      else this.$refs.locationInput.focus();
    },
    focusTests() {
      this.$refs.locationInput.addEventListener("keyup", (event) => {
        if (event.key == "Enter") this.$refs.barcodeInput.focus();
      });

      this.$refs.barcodeInput.addEventListener("keyup", (event) => {
        if (event.key == "Enter") this.$refs.qtyInput.focus();
      });

      this.$refs.qtyInput.addEventListener("keyup", (event) => {
        if (event.key == "Enter") {
          if (this.locationLock) this.$refs.barcodeInput.focus();
          else this.$refs.locationInput.focus();
          
          this.submit();
        }
      });
    },
  },
};
</script>