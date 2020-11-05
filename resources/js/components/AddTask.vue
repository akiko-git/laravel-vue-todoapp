<template>
  <div class="addTask">
    <v-list v-if="isActive">
      <v-list-item small @click="active" class="textColor">
        <v-list-item-icon class="mr-2">
          <v-icon small>fas fa-plus</v-icon>
        </v-list-item-icon>
        <v-list-item-title>プロジェクトを追加</v-list-item-title>
      </v-list-item>
    </v-list>
    <v-form @submit.prevent="add()" v-if="!isActive" class="addTask_form">
      <v-row>
        <v-col class="mx-auto mb-8" cols="8">
          <v-text-field
            v-model="addTaskTitle"
            name="addTaskTitle"
            label="title"
            outlined
          ></v-text-field>
          <v-textarea
            v-model="addTaskText"
            name="addTaskText"
            label="text"
            outlined
            auto-grow
          ></v-textarea>
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="date"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                label="期限"
                prepend-inner-icon="event"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
          <v-row>
            <v-btn type="submit" class="mx-2" color="primary"> 送信 </v-btn>
            <v-btn outlined color="primary" @click="close">キャンセル</v-btn>
          </v-row>
          <div>{{ projectId }}<br />{{ deadline }}<br />{{ category }}</div>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      isActive: true,
      addTaskTitle: "",
      addTaskText: "",
      lists: [],
      date: new Date().toISOString().substr(0, 10),
      menu: false,
    };
  },
  methods: {
    active() {
      this.isActive = !this.isActive;
    },
    close() {
      this.isActive = !this.isActive;
      this.addTaskTitle = "";
      this.addTaskText = "";
    },
    add() {
      const dataform = new FormData();
      dataform.append("addTaskTitle", this.addTaskTitle);
      dataform.append("addTaskText", this.addTaskText);
      dataform.append("date", this.date);
      if (this.projectId) {
        dataform.append("project_id", this.projectId);
      }
      axios
        .post("http://localhost:8001/api/todolist/form", dataform)
        .then((res) => {
          console.log(res.data.success);
          this.lists.push(res.data.success);
          this.$emit("success", res.data.success);
        });
      this.close();
    },
  },
  props: {
    projectId: {
      type: [Number, String],
      default: "",
    },
    deadline: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      default: "",
    },
  },
};
</script>
<style lang="scss" scoped>
.addTask {
  margin-top: 20px;
  .isClick {
    display: block;
  }
  .v-btn__content:hover {
    text-decoration: underline;
  }
  &_form {
    border: solid #000000 1px;
  }
}
</style>

