function PageContent({ children }) {
  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto">
      <div className="min-h-full px-4 py-4 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
        {children}
      </div>
    </main>
  );
}

export default PageContent;
