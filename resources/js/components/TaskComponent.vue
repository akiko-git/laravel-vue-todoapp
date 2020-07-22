<template>


<v-card
	max-width="1000"
	class="mx-auto"
>
	<v-container>

			<v-form @submit.prevent="test()">
			<v-row>
				<v-col class="mx-auto">
					<v-text-field v-model="addTask" label="add task" solo>
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
			<v-col class="mx-auto" cols="8" v-for="list in todolistData">
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
    	props:{
				todolistData:{
					type:Object
				},
			},
			name:'task',
			data(){
				return{
					addTask:""
				};
				console.log(this.addTask);
			},
			methods:{
				test:function(){
					axios.post('http://localhost:8001/todolist/form/',this.addTask).then(res => {
						console.log(res);
					});
				}
			}	
		}	
</script>

