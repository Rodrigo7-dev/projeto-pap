```vue
<template>

<div class="flex min-h-0 flex-1 flex-col">

<div class="min-h-0 flex-1 overflow-auto">

<table class="responsive-table">

<thead class="table-head sticky top-0 z-10">

<slot name="head"/>

</thead>

<tbody>

<slot/>

</tbody>

</table>

</div>

<slot name="pagination"/>

</div>

</template>

<script setup>

</script>
```
