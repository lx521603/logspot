export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'cursor-pointer active:scale-[0.98] transition-transform duration-150'
      },
      defaultVariants: {
        color: 'neutral'
      }
    },
    colors: {
      neutral: 'neutral',
      primary: 'sky'
    },
  },
  seo: {
    title: '91.pt - 老李游记',
    description:
      '91.pt - 老李游记',
    image: '/logo.png',
    url: 'https://mirai.st'
  }
});
