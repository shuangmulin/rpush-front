<template>
  <div class="type-filter-input">
    <div class="type-select">
      <el-dropdown @command="handleCommand">
        <div class="current-type">
          {{ currentTypeName }}
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in options"
            :key="index"
            :command="item"
          >
            {{ item[optionsLabelKey] }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-input v-if="!value.option || !value.option.selectOptions || value.option.selectOptions.length <= 0" size="small" v-model="value.keyword" clearable @keyup.enter.native="handleSearch" @input="handleInput"/>
    <el-select
      v-if="value.option && value.option.selectOptions && value.option.selectOptions.length > 0"
      v-model="value.selectedValue"
      placeholder="请选择"
      size="small"
      @change="handleInput"
      clearable
    >
      <el-option
        v-for="(item) in this.value.option.selectOptions"
        :label="item.label"
        :value="item.id"
        :key="item.id"
      ></el-option>
    </el-select>
    <el-button class="type-filter-search-button" size="small" icon="el-icon-search" @click="handleSearch"></el-button>
  </div>
</template>
<script>
export default {
  name: 'NfTypeFilterInput',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    optionsLabelKey: {
      type: String,
      default: 'label'
    },
    optionsValueKey: {
      type: String,
      default: 'id'
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      currentTypeName: '',
      storageKey: '', // 缓存选项用的key
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    value: {
      handler(){
        this.init()
      },
      deep:true // true 深度监听
    }
  },
  methods: {
    init() {
      let that = this
      this.options.forEach((obj) => {
        that.storageKey += obj[that.optionsValueKey] + obj[that.optionsLabelKey]
      })
      let storageOption = localStorage.getItem(this.storageKey);
      if (!this.value.option && storageOption) {
        this.value.option = JSON.parse(storageOption) // 如果没有传值，就先看下有没有缓存选项
      } else {
        if (this.options.length && !this.value.option) {
          this.value.option = this.options[0] // 没有传值，缓存也没有，就默认选第一个选项
        }
      }
      this.currentTypeName = this.value.option[this.optionsLabelKey]

      this.$emit('change', this.value)
    },
    handleInput() {
      this.$emit('change', this.value)
    },
    handleSearch() {
      this.$emit('search', this.value)
    },
    handleCommand(command) {
      if (command && command[this.optionsValueKey] === this.value.option[this.optionsValueKey]) {
        return // 没变化
      }
      this.value.option = command
      this.value.keyword = ''
      this.value.selectedValue = null
      console.log("计划外")
      this.currentTypeName = this.value.option[this.optionsLabelKey]
      this.$emit('change', this.value)

      localStorage.setItem(this.storageKey, JSON.stringify(this.value.option)); // 缓存选项
    }
  }
}
</script>
<style lang="scss" scoped>
.type-filter-search-button {
  border-left: 0;
  background-color: #F5F7FA;
}

.type-filter-input {
  display: flex;
  align-items: center;
  height: 30px;
  border: 1px solid #d6d8dd;
  border-right: none;
  border-radius: 4px;
  position: relative;

  .type-select {
    min-width: 72px;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    border-radius: 4px;
    text-align: center;
    background-color: #F5F7FA;
    color: #0f1831;
    cursor: pointer;
  }

  .input-wrap {
    height: 100%;
    display: flex;
    align-items: center;
    width: 200px;
    padding: 0 10px;

    input {
      height: 93%;
      flex: 1;
    }
  }

  ::v-deep .el-input .el-input__inner {
    height: 30px;
    line-height: 30px;
    width: 200px;
    padding: 0 25px 0 10px;
    border-radius: 4px;
  }

  .search-icon {
    position: absolute;
    top: 5px;
    right: 5px;
  }
}
</style>
