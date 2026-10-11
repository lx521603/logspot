<template>
  <UContainer class="max-w-4xl">
    <HeroSection />
    <UTimeline :items="items">
      <template #date="{ item }">
        <span class="text-dimmed text-xs/5">
          {{ formatDate(item.date) }}
        </span>
      </template>
      
      <template #title="{ item }">
        <div class="mb-3">
          <h2 class="text-2xl font-bold">{{ item.title }}</h2>
        </div>
      </template>

      <template #description="{ item }">
        <div>
          <ContentRenderer
            v-if="item"
            :value="item"
            class="prose max-w-none prose-img:rounded-md dark:prose-invert"
          />
        </div>
      </template>
    </UTimeline>
    <ThemeToggleButton />
  </UContainer>
</template>

<script setup lang="ts">
const { data: items } = await useAsyncData(
  'changelog-items',
  () => queryCollection('changelog').all(),
  { default: () => [] }
)

/**
 * 100% 可靠的日期格式化函数（纯原生 JS，不依赖任何第三方库）
 */
const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  
  // 确保是 Date 对象
  const dateObj = date instanceof Date ? date : new Date(date)
  
  // 检查日期是否合法
  if (isNaN(dateObj.getTime())) return ''

  // 原生 JS 提取年、月、日（绝对准确，不会出现 0 或星期几）
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1 // JS 的月份是 0-11，所以要 +1
  const day = dateObj.getDate()        // 1-31，绝对不会是 5（除非真的是 5 号）

  // 拼接成你想要的格式： "2月 25, 2013"
  return `${month}月 ${day}, ${year}`
}
</script>