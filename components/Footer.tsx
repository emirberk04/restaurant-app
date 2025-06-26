import Link from 'next/link'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-playfair mb-4">Contact</h3>
            <address className="not-italic">
              <p className="mb-2">123 Restaurant Street</p>
              <p className="mb-2">Istanbul, Turkey</p>
              <p className="mb-2">Tel: (555) 123-4567</p>
              <p>Email: info@restaurant.com</p>
            </address>
          </div>
          <div>
            <h3 className="text-xl font-playfair mb-4">Opening Hours</h3>
            <ul>
              <li className="mb-2">Monday - Friday: 11:00 - 23:00</li>
              <li className="mb-2">Saturday: 10:00 - 23:00</li>
              <li>Sunday: 10:00 - 22:00</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-playfair mb-4">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaFacebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaInstagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                <FaTwitter size={24} />
              </a>
            </div>
            <div className="space-y-2">
              <Link href="/menu" className="block hover:text-primary transition-colors">
                Menu
              </Link>
              <Link href="/reservations" className="block hover:text-primary transition-colors">
                Reservations
              </Link>
              <Link href="/contact" className="block hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; {new Date().getFullYear()} Restaurant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 