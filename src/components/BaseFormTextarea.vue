<template>
  <BaseFormField
    :title="title"
    :error="error"
  >
    <textarea
      v-model="dataValue"
      class="form__input form__input--area"
      name="name"
      :placeholder="placeholder"
    />
  </BaseFormField>
</template>

<script>
import formFieldMixin from '@/mixins/formFieldMixin';

export default {
  mixins: [formFieldMixin]
};
</script>
