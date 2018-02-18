<template>
  <div class="panel-wrap" v-if="tab === 2">
    <div class="panel-row">
      <icon name="link" />
      <div class="panel-label">Cliqué</div>
    </div>

    <div class="panel-row" v-if="activeElement.href !== undefined">
      <div class="panel-label">Lien vers</div>
      <div class="panel-value">
        <input type="text" v-model="activeElement.href" placeholder="Chemin absolu">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['activeElement', 'tab']
}
</script>
