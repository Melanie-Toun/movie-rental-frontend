import React from 'react';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    const handleClick = () => navigate('/admin-panel');
    const handleClickHome = () => navigate('/');

    return (
        <footer className="relative w-full bg-black text-white shadow-lg border-t border-gray-800 px-3 py-4 sm:px-4 sm:py-6 md:py-8">
            {/* Top border line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-700" />

            <div className="container mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                {/* Brand and Logo Section */}
                <div className="md:col-span-3 flex flex-col items-center sm:items-start space-y-2">
                    <div className="h-14 w-14 sm:h-16 sm:w-16">
                        <img
                            src="/ms.svg"
                            alt="logo"
                            className="h-10 w-10 sm:h-12 sm:w-12 cursor-pointer"
                            onClick={handleClickHome}
                        />
                    </div>
                    <div className="text-sm font-bold text-gray-300 text-center sm:text-left">
                        <span>MuiStream</span>
                        <span className="text-xs block md:inline md:ml-1">(Movie Rentals)</span>
                        <span
                            className="text-[10px] block md:inline md:ml-1 cursor-pointer text-blue-400 hover:text-blue-300"
                            onClick={handleClick}
                        >
                            Go
                        </span>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-center sm:text-left text-sm">
                    {[{
                        title: "Company",
                        links: ["About", "Careers", "Contact"]
                    },
                    {
                        title: "Support",
                        links: ["Help", "FAQs", "Terms"]
                    },
                    {
                        title: "Services",
                        links: ["Products", "Pricing", "Docs"]
                    },
                    {
                        title: "Resources",
                        links: ["Blog", "Events", "Guides"]
                    }
                    ].map((section, index) => (
                        <div key={index} className="space-y-2">
                            <h3 className="font-semibold text-gray-300 text-xs">{section.title}</h3>
                            <ul className="space-y-1">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <a
                                            href="#"
                                            className="text-xs text-gray-400 hover:text-blue-400 transition-colors duration-300"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Social and Copyright Section */}
                <div className="md:col-span-3 flex flex-col items-center sm:items-end space-y-2">
                    {/* Social Media Icons */}
                    <div className="flex gap-4 sm:gap-3">
                        {[{
                            Icon: FaFacebookF, link: "www.facebook.com", label: "Facebook"
                        },
                        {
                            Icon: FaTwitter, link: "www.twitter.com", label: "Twitter"
                        },
                        {
                            Icon: FaInstagram, link: "www.instagram.com", label: "Instagram"
                        },
                        {
                            Icon: FaLinkedinIn, link: "www.linkedin.com", label: "LinkedIn"
                        },
                        {
                            Icon: FaYoutube, link: "www.youtube.com", label: "YouTube"
                        }
                        ].map(({ Icon, link, label }, index) => (
                            <a
                                key={index}
                                href={link}
                                target="_blank"
                                aria-label={label}
                                className="group p-3 md:p-2 rounded-full bg-gray-800 hover:bg-blue-400 transition-all duration-300"
                            >
                                <Icon className="text-sm text-gray-400 group-hover:text-white" />
                            </a>
                        ))}
                    </div>

                    {/* Copyright */}
                    <div className="text-center sm:text-right">
                        <p className="text-xs text-gray-400">
                            © {currentYear} Melflix.
                        </p>
                        <p className="text-xs text-gray-500">
                            All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom border line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700" />
        </footer>
    );
};

export default Footer;
