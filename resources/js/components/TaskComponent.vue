<template>
<v-app>
	<v-container>
		<h1>Todolist</h1>
			<v-form @submit.prevent="add()">
			<v-row>
				<v-col class="mx-auto" cols="8">
					<v-text-field v-model="addTaskTitle" name="addTaskTitle" label="add task" solo></v-text-field>
					<v-text-field v-model="addTaskText" name="addTaskText" label="add task text" solo></v-text-field>
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
							 prepend-icon="event"
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

		<v-row dense>
			<v-col class="mx-auto" cols="8" v-for="list in lists">
					<v-list two-line color="#E8EAF6" max-width="500" class="mx-auto">
						<v-list-item-group>
							<v-list-item>
								<v-list-item-content>
									<v-list-item-title>{{ list.title }}</v-list-item-title>
									<v-list-item-subtitle>{{ list.text }}</v-list-item-subtitle>
								</v-list-item-content>
								<v-icon @click="deleteTask(list.id)">mdi-trash-can</v-icon>
							</v-list-item>	
						</v-list-item-group>
					</v-list>
			</v-col>
		</v-row>
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
				};
			},
			created(){
				axios.get('http://localhost:8001/todolist/store').then(res=>{
					this.lists = res.data.getlist;
					return true;
				});
				this.$vuetify.lang = {
        	t : () => {},
      	}
      	this.$vuetify.theme = { dark : false}
			},
			methods:{
				add:function(){
					const dataform = new FormData();
					dataform.append('addTaskTitle',this.addTaskTitle);
					dataform.append('addTaskText',this.addTaskText);
					axios.post('http://localhost:8001/todolist/form',dataform).then(res => {
						console.log(res.data.success);
						this.lists.push(res.data.success);
					});
				},
				deleteTask:function(id){
					axios.delete('http://localhost:8001/todolist/delete'+id).then(res=>{
						//this.lists.splice(res.data.success);
					  this.getList();	
					});	
				},
				getList:function(){
					axios.get('http://localhost:8001/todolist/store').then(res=>{
						this.lists = res.data.getlist;
						return true;
					});
				}
			}	
		}
</script>

