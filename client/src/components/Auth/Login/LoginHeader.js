import React from "react";
import { motion } from "framer-motion";
// import * as S from "./Login.styles";

export const LoginHeader = () => (
  <motion.h1
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="text-center mb-5"
    style={{
      color: "#E10174",
      fontWeight: "bold",
      fontSize: "4rem",
      letterSpacing: "2px",
      textShadow: '2px 2px 4px rgba(225, 1, 116, 0.1)'
    }}
  >
    Welcome Back ..
  </motion.h1>
);