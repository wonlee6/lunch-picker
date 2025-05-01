'use client'

import { Category, Restaurant } from '@/types/restaurant'
import { Button } from '@/components/common/ui/button'
import { Separator } from '@/components/common/ui/separator'
import { CATEGORIES } from '@/constants/categories'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/common/ui/dialog'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Confetti from 'react-confetti'

export interface RestaurantPickerProps {
  selectedCategory: Category | 'all'
  onCategoryChange: (category: Category | 'all') => void
  selectedRestaurant: Restaurant | null
  onPickRandom: () => void
}

export function RestaurantPicker({
  selectedCategory,
  onCategoryChange,
  selectedRestaurant,
  onPickRandom
}: RestaurantPickerProps) {
  const [open, setOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [particles, setParticles] = useState<
    { x: number; y: number; emoji: string; delay: number }[]
  >([])
  const [fireworks, setFireworks] = useState<
    { x: number; y: number; colors: string[]; delay: number }[]
  >([])
  const confettiTimeout = useRef<NodeJS.Timeout | null>(null)

  // 별똥별(Starfall) 컴포넌트
  const Starfall = ({ count = 6 }: { count?: number }) => {
    const stars = Array.from({ length: count }, () => ({
      left: Math.random() * 90 + '%',
      delay: Math.random() * 1.2,
      duration: 1.2 + Math.random() * 0.8
    }))
    return (
      <>
        {stars.map((s, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: -80, x: 0, rotate: 0 }}
            animate={{
              opacity: [0, 1, 0.8, 0],
              y: [0, 300],
              x: [0, 60 + Math.random() * 80],
              rotate: [0, 20, 0]
            }}
            transition={{ duration: s.duration, delay: s.delay, ease: 'easeInOut' }}
            className='pointer-events-none z-[300] absolute'
            style={{ left: s.left, top: 0 }}
          >
            <svg
              width='32'
              height='8'
              viewBox='0 0 32 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <ellipse cx='4' cy='4' rx='4' ry='4' fill='#fffbe9' fillOpacity='0.95' />
              <rect x='6' y='3' width='24' height='2' rx='1' fill='#fffbe9' fillOpacity='0.7' />
            </svg>
          </motion.div>
        ))}
      </>
    )
  }

  // 불꽃놀이(Firework) 컴포넌트
  const Firework = ({
    x,
    y,
    colors,
    delay
  }: {
    x: number
    y: number
    colors: string[]
    delay: number
  }) => {
    const lines = Array.from({ length: 12 }, (__, idx) => ({
      angle: (idx / 12) * 2 * Math.PI,
      color: colors[idx % colors.length]
    }))
    return (
      <>
        {lines.map((l, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: x, y: y, scale: 0.7 }}
            animate={{
              opacity: [0, 1, 0],
              x: [x, x + Math.cos(l.angle) * 60],
              y: [y, y + Math.sin(l.angle) * 60],
              scale: [0.7, 1.2, 0.5]
            }}
            transition={{ duration: 1.3, delay, ease: 'easeOut' }}
            className='absolute pointer-events-none z-[301]'
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 6,
                background: l.color,
                boxShadow: `0 0 16px 4px ${l.color}`
              }}
            />
          </motion.div>
        ))}
      </>
    )
  }

  const AnimatedBg = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.6, 1, 0.7, 1, 0.6], scale: [1, 1.1, 1, 1.08, 1] }}
      transition={{ duration: 2.8, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      className='absolute inset-0 z-0 pointer-events-none bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 opacity-70 blur-2xl rounded-xl'
      style={{ filter: 'blur(60px)' }}
    />
  )

  const Particle = ({
    x,
    y,
    emoji,
    delay
  }: {
    x: number
    y: number
    emoji: string
    delay: number
  }) => (
    <motion.span
      initial={{ opacity: 0, scale: 0.7, x: 0, y: 0 }}
      animate={{
        opacity: [0, 1, 0],
        scale: [0.8, 1.4, 0.6],
        x: [0, x],
        y: [0, y],
        rotate: [0, 360]
      }}
      transition={{ duration: 1.6, delay, ease: 'easeOut' }}
      className='absolute text-3xl pointer-events-none z-[222]'
      style={{ left: '50%', top: '50%', marginLeft: -16, marginTop: -16 }}
    >
      {emoji}
    </motion.span>
  )

  // 파티클 생성
  const launchParticles = () => {
    const arr = Array.from({ length: 16 }, (_, idx) => ({
      x: Math.cos((idx / 16) * 2 * Math.PI) * (120 + Math.random() * 60),
      y: Math.sin((idx / 16) * 2 * Math.PI) * (120 + Math.random() * 60),
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      delay: Math.random() * 0.6
    }))
    setParticles(arr)
    setTimeout(() => setParticles([]), 1800)
  }
  // 불꽃놀이 생성
  const launchFireworks = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const arr = Array.from({ length: 4 }, (_, idx) => ({
      x: Math.random() * 220 - 110,
      y: Math.random() * 120 - 60,
      colors: FIREWORK_COLORS.sort(() => Math.random() - 0.5).slice(0, 4),
      delay: 0.3 + Math.random() * 0.7
    }))
    setFireworks(arr)
    setTimeout(() => setFireworks([]), 1600)
  }

  const handlePickRandom = () => {
    setOpen(true)
    setShowConfetti(false)
    setParticles([])
    setFireworks([])
    setTimeout(() => {
      setShowConfetti(true)
      launchParticles()
      launchFireworks()
      confettiTimeout.current = setTimeout(() => setShowConfetti(false), 2500)
      onPickRandom()
    }, 1500)
  }

  useEffect(() => {
    return () => {
      if (confettiTimeout.current) clearTimeout(confettiTimeout.current)
    }
  }, [])

  const handleClose = () => {
    setOpen(false)
    setShowConfetti(false)
    setParticles([])
    setFireworks([])
    if (confettiTimeout.current) clearTimeout(confettiTimeout.current)
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='mb-3 text-sm font-medium'>카테고리 선택</h3>
        <div className='flex flex-wrap gap-2'>
          {CATEGORIES.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              size='sm'
              onClick={() => onCategoryChange(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div className='space-y-2'>
        <Button className='w-full' size='lg' onClick={handlePickRandom}>
          랜덤 선택하기
        </Button>
        <p className='text-xs text-center text-muted-foreground'>
          선택한 카테고리에서 랜덤으로 가게를 추천해 드립니다.
        </p>
      </div>

      {/* 룰렛 모달 */}
      <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogContent className='z-[220]'>
          <DialogHeader>
            <DialogTitle>룰렛 돌리는 중...</DialogTitle>
          </DialogHeader>
          <div className='relative flex flex-col items-center justify-center min-h-[220px]'>
            <AnimatedBg />
            {/* 별똥별 */}
            <Starfall count={8} />
            {/* 폭죽 */}
            {showConfetti && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={900}
                wind={0.05}
                gravity={0.12}
                initialVelocityY={28}
                tweenDuration={1000}
                recycle={false}
                className='fixed top-0 left-0 pointer-events-none z-[9999]'
              />
            )}
            {/* 불꽃놀이 */}
            {fireworks.map((fw, idx) => (
              <Firework key={idx} {...fw} />
            ))}
            {/* 이모지 파티클 */}
            {particles.map((p, idx) => (
              <Particle key={idx} {...p} />
            ))}
            <AnimatePresence mode='wait'>
              {!selectedRestaurant ? (
                <motion.span
                  key='roulette-spin'
                  initial={{ rotate: 0, scale: 0.7, opacity: 0 }}
                  animate={{
                    rotate: [0, 360, 0, 360, 0],
                    scale: [0.7, 1.2, 1.14, 1.3, 1.1],
                    opacity: [0, 1, 1, 1, 1],
                    color: ['#e11d48', '#f59e42', '#2563eb', '#059669', '#e11d48']
                  }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 1.4, times: [0, 0.25, 0.5, 0.75, 1], ease: 'easeInOut' }}
                  className='text-6xl drop-shadow-xl animate-spin-slow font-extrabold'
                >
                  🎰
                </motion.span>
              ) : (
                <motion.div
                  key='roulette-result'
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{
                    scale: 1.24,
                    opacity: 1,
                    rotate: [0, 8, -8, 0],
                    backgroundColor: ['#fff0f6', '#fef9c3', '#e0f2fe', '#f0fdf4', '#fff0f6']
                  }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.9, type: 'tween' }}
                  className='flex flex-col items-center gap-2 rounded-xl px-6 py-4 shadow-xl border border-pink-200'
                >
                  <span className='text-2xl font-bold mb-2 text-pink-600 drop-shadow-glow  animate-bounce'>
                    {selectedRestaurant.place_name}
                  </span>
                  <span className='text-base text-blue-600 font-semibold animate-pulse'>
                    {selectedRestaurant.category_name}
                  </span>
                  <span className='text-sm text-emerald-600 font-medium animate-fade-in-down'>
                    {selectedRestaurant.road_address_name}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button onClick={handleClose} className='w-full mt-2'>
            닫기
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

const EMOJIS = [
  '🍕',
  '🍔',
  '🍣',
  '🥟',
  '🍜',
  '🍗',
  '🥗',
  '🍩',
  '🍦',
  '🥨',
  '🧁',
  '🍟',
  '🍱',
  '🍛',
  '🍙',
  '🍚',
  '🍝'
]
const FIREWORK_COLORS = [
  '#fbbf24',
  '#f472b6',
  '#60a5fa',
  '#34d399',
  '#f87171',
  '#fff',
  '#fde68a',
  '#c7d2fe'
]
