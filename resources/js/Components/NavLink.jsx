import { Link } from '@inertiajs/react'; // <-- PASTIKAN ADA BARIS INI

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-bold leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-yellow-400 text-white ' 
                    : 'border-transparent text-blue-200 hover:text-white hover:border-blue-300 ') +
                className
            }
        >
            {children}
        </Link>
    );
}