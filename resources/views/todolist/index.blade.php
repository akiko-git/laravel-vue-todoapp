@extends('layouts.app')

@section('content')
<h1>Todolist</h1>

<div id="app">
	<task v-bind:todolist-data={{ $tasks }}></task>
</div>
@endsection
