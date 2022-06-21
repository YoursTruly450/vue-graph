<template>
  <div class="dialog">
    <div class="dialog__overlay" @click.stop="$emit('closeDialog')"></div>
    <div class="dialog__container">
      <div class="dialog__header">{{node.id}}</div>
      <div class="dialog__entries">
        <div class="dialog__entries_item">
          <span class="dialog__entries_label">Тип атрибута</span>
          <select
            class="dialog__entries_select"
            v-model="attribute.type"
          >
            <option
              v-for="option in typeOptions"
              :key="option.id"
              :value="option.value"
            >
              {{option.value}}
            </option>
          </select>
        </div>
        <div class="dialog__entries_item">
          <span class="dialog__entries_label">Имя атрибута</span>
          <input
            class="dialog__entries_select"
            v-model="attribute.name"
            placeholder="lego:"
          />
        </div>
        <div
          class="dialog__entries_item"
          v-if="attribute.type === 'attribute'"
        >
          <span class="dialog__entries_label">Значение атрибута</span>
          <input
            class="dialog__entries_select"
            v-model="attribute.value"
            placeholder="значение"
          />
        </div>
      </div>
      <div v-if="!isAttrTypeChosen" class="dialog__alert">
        Не заполнены поля
      </div>
      <div class="dialog__controls">
        <button
          class="dialog__controls_button"
          @click.stop="$emit('closeDialog')"
        >
          Отменить
        </button>
        <button
          class="dialog__controls_button"
          :class="{'dialog__controls_button-disabled': !isAttrTypeChosen}"
          @click="setNewNode"
          :disabled="!isAttrTypeChosen"
        >
          Сохранить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DialogView',
  props: {
    node: { type: Object },
  },
  data() {
    return {
      attribute: {
        type: '',
        name: '',
        value: '',
      },
      typeOptions: [
        {
          id: 1,
          value: 'node',
        },
        {
          id: 2,
          value: 'attribute',
        },
      ],
    };
  },
  computed: {
    isAttrTypeChosen() {
      return this.attribute.type !== '' && this.attribute.name !== '' && (this.attribute.type === 'node' || this.attribute.value !== '');
    },
  },
  methods: {
    setNewNode() {
      if (this.isAttrTypeChosen) {
        this.$emit('setNewNode', this.attribute);
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/assets/graph/dialog.scss';
</style>
