'use client';

const Layout = ({ children }: { children: any }) => {
    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};

export default Layout; 