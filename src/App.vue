<template>
  <div id="app">
    <calendar id="calendar" />
  </div>
</template>

<script>
import Calendar from '@/components/Calendar';

export default {
  name: 'App',
  components: { Calendar },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  margin-top: 60px;
}

#calendar {
  margin: 0 auto;
  width: 900px;
}
</style>
