import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Ideas from './pages/Ideas.jsx'
import Articles from './pages/Articles.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import './App.css'
import CompletedPage from './pages/CompletedPage.jsx'
import CompletedReader from './pages/CompletedReader.jsx'
import Publication from './pages/Publications.jsx'
import Feed from './pages/Feed.jsx'
import PublicArticle from './pages/PublicArticle.jsx'
import PublicProfile from './pages/PublicProfile.jsx'

function AnimatedRoutes() {
  const location = useLocation()

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    in: {
      opacity: 1,
      y: 0,
    },
    out: {
      opacity: 0,
      y: -20,
    },
  }

  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3,
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Home />
          </motion.div>
        } />
        <Route path="/login" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Login />
          </motion.div>
        } />
        <Route path="/ideas" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Ideas />
          </motion.div>
        } />
        <Route path="/articles" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Articles />
          </motion.div>
        } />
        <Route path="/dashboard" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Dashboard />
          </motion.div>
        } />
        <Route path="/completed" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <CompletedPage />
          </motion.div>
        } />
        <Route path="/completed/:id" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <CompletedReader />
          </motion.div>
        } />
        <Route path="/published" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Publication />
          </motion.div> 
        }/>
        <Route path="/profile" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Profile />
          </motion.div>
        } />
        <Route path="/feed" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <Feed />
          </motion.div>
        } />
        <Route path="/read/:id" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <PublicArticle />
          </motion.div>
        } />
        <Route path="/user/:username" element={
          <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <PublicProfile />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  )
}

export default App
