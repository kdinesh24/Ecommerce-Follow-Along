"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Linkedin, Facebook, Youtube, ChevronUp, ChevronDown } from "lucide-react"

const NavLink = ({ href, children }) => (
  <motion.a
    href={href}
    className="group relative text-gray-100 hover:text-white transition-colors"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span>{children}</span>
    <motion.span
      className="absolute left-0 bottom-0 h-[1px] bg-white"
      initial={{ width: 0 }}
      whileHover={{ width: "100%" }}
      transition={{ duration: 0.3 }}
    />
  </motion.a>
)

const SocialIcon = ({ Icon, href }) => (
  <motion.a
    href={href}
    className="p-2 bg-zinc-900 rounded-lg hover:bg-zinc-800"
    whileHover={{ scale: 1.1, rotate: 5 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={20} />
  </motion.a>
)

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="px-4 sm:px-2">
      <motion.footer
        className="bg-black text-gray-100 py-8 px-8 rounded-[2rem] w-full max-w-[1450px] mx-auto relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Expand/Collapse Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute top-8 right-8 p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isExpanded ? "Collapse footer" : "Expand footer"}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isExpanded ? "collapse" : "expand"}
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <div className="max-w-7xl mx-auto">
          {/* Basic Footer Content - Always Visible */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <motion.div
                className="bg-white rounded-lg px-3 py-1.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-black font-bold text-lg">MV</span>
              </motion.div>

              {/* Social Icons */}
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <SocialIcon Icon={Instagram} href="#" />
                <SocialIcon Icon={Linkedin} href="#" />
                <SocialIcon Icon={Facebook} href="#" />
                <SocialIcon Icon={Youtube} href="#" />
              </motion.div>
            </div>

            {/* Basic Info */}
            <motion.div
              className="mt-4 mr-12 md:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <motion.div
                  className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-3 h-3 border-2 border-gray-400 rounded-full" />
                </motion.div>
                <span>Designed in Austria, Europe</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Expandable Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8 border-t border-zinc-800"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  {/* Navigation Links */}
                  <div>
                    <ul className="space-y-4 text-lg">
                      {["Technology", "Company", "Shop", "Commercial", "Blog", "Contact"].map((item, index) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                        >
                          <NavLink href="#">{item}</NavLink>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <ul className="space-y-4 text-grey">
                      {[
                        "Shipping & Delivery",
                        "Privacy Policy",
                        "Revocation",
                        "Terms & Conditions",
                        "Imprint",
                        "Press kit",
                      ].map((item, index) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index, duration: 0.3 }}
                        >
                          <NavLink href="#">{item}</NavLink>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Additional Info */}
                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
                      <span className="text-2xl">€</span>
                      <span>100-day money-back guarantee</span>
                    </motion.div>

                    <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
                      <motion.div
                        className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        🌍
                      </motion.div>
                      <span>Global express shipping</span>
                    </motion.div>
                  </motion.div>

                  {/* Legal Text */}
                  <motion.div
                    className="text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <p>
                      These statements have not been evaluated by the Food and Drug Administration. In the European
                      Union, the intended use of our products does not fall within the scope or article 2 section 1 of
                      2017/45 MDR.
                    </p>
                  </motion.div>
                </motion.div>

                {/* Payment Methods */}
                <motion.div
                  className="mt-8 flex flex-wrap gap-4 items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {["PayPal", "Mastercard", "Visa", "American Express", "Klarna"].map((method, index) => (
                    <motion.img
                      key={method}
                      src={`/api/placeholder/80/32`}
                      alt={method}
                      className="h-8"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.footer>
    </div>
  )
}

export default Footer

