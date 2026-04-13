<template>
    <div>
        <h2>Iterate over JSON Data</h2>
    </div>

    <div v-for="item in data" :key="item.id">
        <p>{{ item.ProductName }}</p>
        <p>{{ item.Price }}</p>
        <p>{{ item.ProductName }}</p>
    </div>
</template>

<script>
import jsonData from '/jsonData.json';
    export default {
        data() {
            return {
                data: jsonData 
            }
        }
    }
</script>

<style>
label{
        font-weight: bold;
}
</style>