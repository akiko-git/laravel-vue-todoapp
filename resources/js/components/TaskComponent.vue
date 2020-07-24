<template>


<v-card
	max-width="1000"
	class="mx-auto"
>
	<v-container>

			<v-form @submit.prevent="add()">
			<v-row>
				<v-col class="mx-auto">
					<v-text-field v-model="addTask" name="addTask" label="add task" solo>
						<template v-slot:append-outer>
							<v-btn type="submit" class="mx-2" fab dark color="#3F51B5">
								<v-icon color="#FFFFFF">mdi-plus</v-icon>
							</v-btn>	
						</template>
					</v-text-field>
				</v-col>
			</v-row>
		</v-form>

		<v-row dense>
			<v-col class="mx-auto" cols="8" v-for="list in lists">
				<v-card
					color="#E8EAF6"
				>
					<v-card-title class="headline">
						<v-card-title>{{ list.title }}</v-card-title>
						<v-card-text>{{ list.text }}</v-card-text>
					</v-card-title>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</v-card>
</template>

<script>
    export default {
			data(){
				return{
					addTask:"",
					lists:[],
				};
			},
			created(){
				axios.get('http://localhost:8001/todolist/store').then(res=>{
					this.lists = res.data.getlist;
					return true;
				});
			},
			methods:{
				add:function(){
					const dataform = new FormData();
					dataform.append('addTask',this.addTask);
					axios.post('http://localhost:8001/todolist/form',dataform).then(res => {
						console.log(res.data.success);
						this.lists.push(res.data.success);
					});
				},
			}	
		}
</script>

