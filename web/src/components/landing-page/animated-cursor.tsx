import { useEffect, useState } from "react"
import {
  Cursor,
  CursorBody,
  CursorMessage,
  CursorName,
  CursorPointer,
} from "../ui/cursor"

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLLABORATORS = [
  {
    name: "Yoasobi",
    color: "#FF3737",
    // positions: [x%, y%] waypoints
    keyframes: [
      [12, 18],
      [18, 22],
      [10, 28],
      [16, 20],
      [12, 18],
    ],
    duration: 8,
    message: "Editing colors...",
  },
  {
    name: "Aimyon",
    color: "#A259FF",
    keyframes: [
      [75, 12],
      [82, 8],
      [78, 18],
      [70, 10],
      [75, 12],
    ],
    duration: 11,
    message: "Looks good!",
  },
  {
    name: "Ado",
    color: "#0ACF83",
    keyframes: [
      [8, 52],
      [14, 58],
      [6, 64],
      [12, 56],
      [8, 52],
    ],
    duration: 14,
    message: "Updating tokens",
  },
  {
    name: "MyGO!!!!!",
    color: "#0ACF83",
    keyframes: [
      [78, 45],
      [85, 52],
      [80, 60],
      [72, 50],
      [78, 45],
    ],
    duration: 10,
    message: "Typography done",
  },
  {
    name: "Tuki.",
    color: "#FFCD29",
    keyframes: [
      [10, 80],
      [18, 75],
      [14, 85],
      [8, 78],
      [10, 80],
    ],
    duration: 7,
    message: "Checking shadows",
  },
  {
    name: "Roselia",
    color: "#FF7237",
    keyframes: [
      [70, 82],
      [78, 88],
      [72, 92],
      [64, 86],
      [70, 82],
    ],
    duration: 13,
    message: "Adding badge",
  },
  {
    name: "Yorushika",
    color: "#1ABCFE",
    keyframes: [
      [42, 8],
      [50, 12],
      [44, 18],
      [36, 10],
      [42, 8],
    ],
    duration: 9,
    message: "Nice palette!",
  },
]

type Collaborator = (typeof COLLABORATORS)[0]

// ─── Single cursor ────────────────────────────────────────────────────────────

function FloatingCursor({
  name,
  color,
  keyframes,
  duration,
  message,
}: Collaborator) {
  const [index, setIndex] = useState(0)
  const [showMsg, setShowMsg] = useState(true)

  const current = keyframes[index]

  // Step through waypoints, each step = duration / segments seconds
  useEffect(() => {
    const stepMs = (duration / (keyframes.length - 1)) * 1000
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % keyframes.length)
    }, stepMs)
    return () => clearInterval(timer)
  }, [duration, keyframes.length])

  // Independent message blink
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const cycle = (visible: boolean) => {
      setShowMsg(visible)
      timeout = setTimeout(
        () => cycle(!visible),
        visible ? 2500 + Math.random() * 2500 : 800 + Math.random() * 1500
      )
    }
    const init = setTimeout(() => cycle(true), Math.random() * 4000)
    return () => {
      clearTimeout(timeout)
      clearTimeout(init)
    }
  }, [])

  const stepMs = (duration / (keyframes.length - 1)) * 1000

  return (
    <Cursor
      color={color}
      className="absolute"
      style={{
        left: `${current[0]}%`,
        top: `${current[1]}%`,
        transition: `left ${stepMs}ms ease-in-out, top ${stepMs}ms ease-in-out`,
      }}
    >
      <CursorPointer />
      <CursorBody>
        <CursorName>{name}</CursorName>
        {showMsg && <CursorMessage>{message}</CursorMessage>}
      </CursorBody>
    </Cursor>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function AnimatedCursor() {
  return (
    <>
      {COLLABORATORS.map((c) => (
        <FloatingCursor key={c.name} {...c} />
      ))}
    </>
  )
}
