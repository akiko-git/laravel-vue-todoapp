<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeTasksTableColumProjectId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn('text');
            $table->integer('status')->nullable(false)->default(1)->change();
            $table->foreignId('project_id')->nullable(false)->default(0)->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->text('text')->nullable();
            $table->text('status')->nullable()->change();
            $table->foreignId('project_id')->nullable()->change()->constrained()->onDelete('cascade');
        });
    }
}
