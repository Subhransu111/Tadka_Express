const Testimonials = () => {
  return (
    <section className="py-28 px-6 bg-white dark:bg-[#161616] transition-all duration-500">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          What Our Customers Say
        </h2>

        <div className="mt-16 p-10 rounded-2xl 
          bg-lightBg dark:bg-darkCard
          shadow-md dark:shadow-[0_0_25px_rgba(255,107,0,0.15)]
          hover:-translate-y-2 transition-all duration-300">

          <p className="text-lg italic text-gray-700 dark:text-gray-300 leading-relaxed">
            “Tadka Express has completely changed my daily routine.
            The food tastes homemade, fresh, and always arrives on time.
            Highly recommended!”
          </p>

          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              Rahul Sharma
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Working Professional
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Testimonials;