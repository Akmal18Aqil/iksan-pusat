export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 ${
                active
                    ? 'border-yellow-400 bg-blue-800 text-white font-bold'
                    : 'border-transparent text-blue-100 hover:text-white hover:bg-blue-700 hover:border-blue-300'
            } text-base font-medium focus:outline-none transition duration-150 ease-in-out ${className}`}
        >
            {children}
        </Link>
    );
}