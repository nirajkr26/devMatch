import { AppLogo, GithubIcon, LinkedinIcon } from '../utils/Icons';

const Footer = () => {
    return (
        <footer className="footer sm:footer-horizontal text-base-content items-center p-10 bg-base-300 border-t border-base-200">
            <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                <aside className="flex flex-col gap-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <AppLogo
                            width={28}
                            height={28}
                            className="fill-primary transform hover:rotate-12 transition-transform"
                        />
                        <span className="text-2xl font-black tracking-tighter text-primary">devMatch</span>
                    </div>
                    <p className="max-w-xs opacity-60 text-sm">
                        Building a curated space for developers to connect, code, and innovate together.
                    </p>
                    <p className="text-xs font-medium opacity-40 mt-2">
                        Copyright © {new Date().getFullYear()} - All rights reserved.
                    </p>
                </aside>

                <nav className="flex flex-col gap-4">
                    <h6 className="footer-title opacity-100 text-xs font-bold uppercase tracking-widest text-secondary">Connect with me</h6>
                    <div className="flex gap-6 justify-center md:justify-start mt-1">
                        <a
                            href="https://github.com/nirajkr26/devMatch"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base-content hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <GithubIcon width={28} height={28} className="fill-current" />
                        </a>
                        <a
                            href="https://linkedin.com/in/nirajkr26"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base-content hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <LinkedinIcon width={28} height={28} className="fill-current" />
                        </a>
                    </div>
                </nav>
            </div>
        </footer>
    );
}

export default Footer;