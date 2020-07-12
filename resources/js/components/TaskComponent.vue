<template>

<v-card
	max-width="500"
	class="mx-auto"
>
	<v-container>
		<v-row dense>
			<v-col cols="12" v-for="list in todolistData">
				<v-card
					dark
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
			name:'task'
		}
</script>

