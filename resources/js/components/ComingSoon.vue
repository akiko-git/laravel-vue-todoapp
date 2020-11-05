<template>
  <div>近日予定です！！</div>
</template>
          <v-list>
            <v-list-item @click="type = 'day'">
              <v-list-item-title>Day</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'week'">
              <v-list-item-title>Week</v-list-item-title>
            </v-list-item>
            <v-list-item @click="type = 'month'">
              <v-list-item-title>Month</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-sheet height="600">
        <v-calendar
          color="red"
          ref="calendar"
          v-model="focus"
          :type="type"
          :events="events"
          :event-color="getEventColor"
          @click:event="showEvent"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-card-text>
              <span v-html="selectedEvent.name"></span> </v-card-text
          ></v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>
<script>
export default {
  created() {
    console.log("近日公開だよ");
  },
};
</script>