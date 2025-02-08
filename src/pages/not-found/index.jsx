const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-neutral-600">
        404 - Page Not Found
      </h1>
      <p className="text-lg text-gray-700 mt-4">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
};

export default NotFound;
