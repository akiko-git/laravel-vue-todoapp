<template>
<v-app>
	<v-container>
		<h1>Todolist</h1>
			<v-form @submit.prevent="add()">
			<v-row>
				<v-col class="mx-auto mb-8" cols="8">
					<v-text-field v-model="addTaskTitle" name="addTaskTitle" label="title" outlined></v-text-field>
					<v-textarea v-model="addTaskText" name="addTaskText" label="text" outlined auto-grow></v-textarea>
					<v-menu
					 ref="menu"
					 v-model="menu"
					 :close-on-content-click="false"
					 :return-value.sync="date"
					 transition="scale-transition"
					 offset-y
					 min-width="290px"
					>
						<template v-slot:activator="{ on,attrs }">
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
          		<v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
        		</v-date-picker>
					</v-menu>
					<v-btn type="submit" class="mx-2">
						送信
					</v-btn>	
				</v-col>
			</v-row>
		</v-form>

			<v-card class="mx-auto" color="#E8EAF6" max-width="790" v-for="list in lists">
					<v-card-title>{{ list.title }}</v-card-title>
					<v-card-text class="pb-2"><pre class="mb-0">{{ list.text }}</pre></v-card-text>
					<v-card-actions>
					<v-card-text class="pt-2 px-2">期限：{{ list.deadline }}</v-card-text>
					<v-icon @click="deleteConfirm(list.id,list.title)">mdi-trash-can</v-icon>
					</v-card-actions>
			</v-card>
		<v-dialog v-model="deleteDialog" persistent max-width="300">
				<v-card>
					<v-card-title>削除確認</v-card-title>
					<v-card-text>{{ deleteTitle }}を削除してもよろしいですか？</v-card-text>
					<v-card-actions>
						<v-btn color="green darken-1" text @click="deleteDialog = false">キャンセル</v-btn>
						<v-btn color="green darken-1" text @click="deleteTask(deleteID)">削除</v-btn>
					</v-card-actions>
				</v-card>
		</v-dialog>
	</v-container>
</v-app>
</template>

<script>
    export default {
			data(){
				return{
					addTaskTitle:"",
					addTaskText:"",
					lists:[],
					date: new Date().toISOString().substr(0, 10),
					menu: false,
					deleteDialog:false,
					deleteID : null,
					deleteTitle : null,
				};
			},
			methods:{
				add:function(){
					const dataform = new FormData();
					dataform.append('addTaskTitle',this.addTaskTitle);
					dataform.append('addTaskText',this.addTaskText);
					dataform.append('date',this.date);
					axios.post('http://localhost:8001/api/todolist/form',dataform).then(res => {	
						console.log(res.data.success)
						this.lists.push(res.data.success)
					});
				},
				deleteConfirm:function(id,title){
					this.deleteDialog = true;
					this.deleteID = id;
					this.deleteTitle = title;
				},
				deleteTask:function(id){
					axios.delete('http://localhost:8001/api/todolist/delete'+id).then(res=>{
						//this.lists.splice(res.data.success);
					  this.getList();	
					});
					this.deleteDialog = false;
				},
				getList:function(){
					axios.get('http://localhost:8001/api/todolist/store').then(res=>{
						this.lists = res.data.getlist;
						//console.log(res.data.getlist.text);
						//console.log(res.data.getlist);
						console.log(res);
						return true;
					});
				}
			},
			created(){
				console.log('shirotan')
				this.getList()
				this.$vuetify.lang = {
        	t : () => {},
      	}
      	this.$vuetify.theme = { dark : false}
			}
		}
</script>

