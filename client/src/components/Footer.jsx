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

const PaymentLogo = ({ src, alt }) => (
  <motion.div
    className="h-8 w-20 relative"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <img 
      src={src}
      alt={alt}
      className="h-full w-full object-contain"
    />
  </motion.div>
)

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const paymentMethods = [
    {
      name: "PayPal",
      logo: "https://cdn.prod.website-files.com/671898ae57fbee5bf1da9fba/671b83d3df8f35516fe3654a_Paypal%20Logo%201.svg"
    },
    {
      name: "Visa",
      logo: "https://cdn.prod.website-files.com/671898ae57fbee5bf1da9fba/671b83d3e35ea2884ff9c21d_Visa%20Inc.%20logo%201.svg"
    },
    {
      name: "American Express",
      logo: "https://cdn.prod.website-files.com/671898ae57fbee5bf1da9fba/671b83d35c1ff059444f715d_american.svg"
    },
    {
      name: "Apple Pay",
      logo: "https://cdn.prod.website-files.com/671898ae57fbee5bf1da9fba/671b83d3041007db7bdb4455_Apple%20Pay%20logo%201.svg"
    },
    {
      name: "Google Pay",
      logo: "https://cdn.prod.website-files.com/671898ae57fbee5bf1da9fba/671b83d3cc6fd600174e2acb_Google%20Pay%20Logo%201.svg"
    }
  ]

  return (
    <div className="px-4 sm:px-2">
      <motion.footer
        className="bg-black text-gray-100 py-8 px-8 rounded-[2rem] w-full max-w-[1450px] mx-auto relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center space-x-8">
              <motion.div
                className="bg-white rounded-lg px-3 py-1.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-black font-bold text-lg">MV</span>
              </motion.div>

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
                <span>Designed in India</span>
              </div>
            </motion.div>
          </motion.div>

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

                  <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
                      <span className="text-2xl">₹</span>
                      <span>100-day money-back guarantee</span>
                    </motion.div>

                    <motion.div className="flex items-center space-x-2" whileHover={{ scale: 1.05 }}>
                      <motion.div
                        className="w-6 h-6 border border-gray-400 rounded-full flex items-center justify-center cursor-pointer"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        🌍
                      </motion.div>
                      <span>Global express shipping</span>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="text-sm text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <p>
                      At Makers Vault, we celebrate the beauty of handcrafted innovation. Our curated collection brings you exclusive,
                      high-quality products made by passionate independent makers from around the world.
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="mt-8 flex flex-wrap gap-6 items-center justify-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  {paymentMethods.map((method, index) => (
                    <motion.div
                      key={method.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <PaymentLogo src={method.logo} alt={`${method.name} logo`} />
                    </motion.div>
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