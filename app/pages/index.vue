<template>
  <UContainer class="max-w-4xl">
    <HeroSection />
    
    <!-- 时间线主体 -->
    <UTimeline :items="items">
      <template #date="{ item }">
        <span class="text-dimmed text-xs/5">
          {{ formatDate(item.date) }}
        </span>
      </template>
      
      <template #title="{ item }">
        <div class="mb-3 flex items-center gap-3">
          <UIcon 
            v-if="item.icon" 
            :name="item.icon" 
            class="w-6 h-6 text-primary flex-shrink-0" 
          />
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

    <!-- 🌟 底部加载区域：渐变提示 + 滚动哨兵（无按钮） -->
    <div class="relative mt-12 mb-8">
      
      <!-- 渐变提示条：告诉用户下面还有内容 -->
      <div 
        v-if="hasMore && !isLoading" 
        class="absolute -top-20 left-0 right-0 h-20 bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900 pointer-events-none"
      ></div>

      <!-- 滚动哨兵 + 加载提示 -->
      <div ref="sentinel" class="py-8 flex items-center justify-center">
        <div v-if="isLoading" class="flex items-center gap-2 text-dimmed text-sm">
          <UIcon name="i-lucide-loader-2" class="w-4 h-4 animate-spin" />
          <span>正在加载更多游记...</span>
        </div>
        
        <div v-else-if="!hasMore && items.length > 0" class="text-dimmed text-sm">
          已经到底啦,没有更多游记了 ~
        </div>
      </div>
    </div>

    <ThemeToggleButton />
  </UContainer>
</template>

<script setup lang="ts">
// 🌟 每次加载 3 条，更流畅
const PAGE_SIZE = 3
const limit = ref(PAGE_SIZE)
const items = ref<any[]>([])
const hasMore = ref(true)
const isLoading = ref(false)
const sentinel = ref<HTMLElement | null>(null)

/**
 * 核心查询函数
 */
const fetchItems = async () => {
  if (isLoading.value || !hasMore.value) return
  
  isLoading.value = true
  
  try {
    const result = await queryCollection('changelog')
      .order('date', 'DESC')
      .limit(limit.value)
      .all()
    
    items.value = result
    
    if (result.length < limit.value) {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载游记失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 首次加载
await fetchItems()

// 滚动自动加载
onMounted(() => {
  if (!sentinel.value) return
  
  const observer = new IntersectionObserver(
    (entries) => {
      const isIntersecting = entries[0].isIntersecting
      
      if (isIntersecting && hasMore.value && !isLoading.value) {
        limit.value += PAGE_SIZE
        fetchItems()
      }
    },
    { rootMargin: '200px' } // 提前 200px 触发，更流畅
  )
  
  observer.observe(sentinel.value)
  
  onUnmounted(() => {
    observer.disconnect()
  })
})

/**
 * 日期格式化
 */
const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  const dateObj = date instanceof Date ? date : new Date(date)
  if (isNaN(dateObj.getTime())) return ''
  return `${dateObj.getMonth() + 1}月 ${dateObj.getDate()}, ${dateObj.getFullYear()}`
}
</script>