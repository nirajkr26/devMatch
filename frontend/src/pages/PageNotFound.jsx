import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <>
            <section className=" py-[120px]">
                <div className="container mx-auto">
                    <div className="-mx-4 flex">
                        <div className="w-full px-4">
                            <div className="mx-auto max-w-[400px] text-center">
                                <h2 className="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]">
                                    404
                                </h2>
                                <h4 className="mb-3 text-[22px] font-semibold leading-tight text-white">
                                    Oops! That page can’t be found
                                </h4>
                                <p className="mb-8 text-lg text-white">
                                    The page you are looking for it maybe deleted
                                </p>
                                <Link to={"/"}>
                                    <button className="btn btn-outline btn-xs sm:btn-sm md:btn-md lg:btn-lg xl:btn-xl">Go To Home</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </section >
        </>
    );
};



export default PageNotFound