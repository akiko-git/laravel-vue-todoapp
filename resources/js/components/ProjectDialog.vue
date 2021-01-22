<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template #activator="{ on, attrs }"><!--eslint-disable-line-->
      <slot name="activator" :on="{ click: open }" />
    </template>
    <v-card>
      <v-card-title>プロジェクトを{{ dialogTitle }}</v-card-title>
      <v-divider />
      <form @submit.prevent="submitProject()">
        <v-card-text>
          <v-text-field v-model="project.project" :counter="20" />
        </v-card-text>
        {{ project.project }}
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="close"> キャンセル </v-btn>
          <v-btn type="submit" color="blue darken-1" text :disabled="addText">
            {{ dialogBtnText }}
          </v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>
<script>
  import { mapActions } from 'vuex';
  export default {
    props: {
      dialogTitle: {
        type: String,
        default: '追加',
      },
      dialogBtnText: {
        type: String,
        default: '追加',
      },
      editData: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        dialog: false,
        project: {},
      };
    },
    computed: {
      addText() {
        if (this.project.project) {
          return false;
        } else {
          return true;
        }
      },
    },
    created() {},
    methods: {
      ...mapActions('project', ['createProject', 'updateProject']),
      open() {
        if (this.editData) {
          this.project = Object.assign({}, this.editData);
        }
        this.dialog = true;
      },
      close() {
        this.project = {};
        this.dialog = false;
        this.$emit('close');
      },
      //フォーム送信
      submitProject() {
        if (this.editData) {
          this.editProject();
        } else {
          this.registProject();
        }
      },
      //プロジェクトを登録
      registProject() {
        this.createProject(this.project).then((res) => {
          if (res === true) {
            alert('プロジェクトを追加しました');
          } else {
            alert('プロジェクトの追加に失敗しました');
          }
        });
        this.close();
      },
      //プロジェクトを編集
      editProject() {
        this.updateProject(this.project).then((res) => {
          if (res === true) {
            // console.log("編集したプロジェクト");
            // console.log(this.project);
            alert('プロジェクトを更新しました');
          } else {
            alert('プロジェクトの更新に失敗しました');
          }
        });
        this.close();
      },
    },
  };
</script>
