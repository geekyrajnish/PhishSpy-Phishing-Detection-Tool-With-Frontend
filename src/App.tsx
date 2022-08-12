import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useRef, useState } from "react";
import LoaderPulse from "./components/LoaderPulse";
import { PieChart } from "react-minimal-pie-chart";

const App: React.FC = () => {
  const [url, setUrl] = useState<string>();
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const baseUrl = "https://phishspy.herokuapp.com";
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const fetchCount = () => {
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };
    fetch(baseUrl + "/count", requestOptions)
      .then((res) => res.text())
      .then((result) => setCount(JSON.parse(result).count))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    executeScroll();
  }, [data]);

  const fetchData = () => {
    setIsLoading(true);
    const requestOptions = {
      method: "POST",
      body: JSON.stringify({
        url: url,
      }),
      headers: myHeaders,
    };

    fetch(baseUrl + "/checkphishing", requestOptions)
      .then((res) => res.text())
      .then((result) => {
        setIsLoading(false);
        fetchCount();
        return setData(JSON.parse(result));
      })
      .catch((err) => {
        setIsLoading(false);
        console.error(err);
      });
  };

  const myRef = useRef<HTMLDivElement>(null);

  const executeScroll = () => {
    console.log("Executed");
    if (myRef.current) {
      window.scrollTo({ behavior: "smooth", top: myRef.current.offsetTop });
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center my-20 mx-4 md:mx-20 space-y-4 text-center">
        <div>
          <h1 className="text-4xl font-mono font-bold text-amber-300 hover:text-amber-700 transform transition-all delay-200 hover:animate-pulse my-5">
            PhishSpy*
          </h1>
        </div>
        <form
          onSubmit={(e) => {
            fetchData();
            e.preventDefault();
          }}
          className="w-full mx-4 md:w-1/2 flex flex-col space-y-4 justify-center items-center"
        >
          <input
            name="url"
            placeholder="Enter an URL to check phishing"
            className="bg-white bg-opacity-5 py-3 px-10 w-full outline-none bg-transparent text-white font-mono text-center focus:bg-slate-700 hover:bg-slate-800"
            required
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="border py-2 px-4 text-white font-mono hover:bg-slate-800 focus:bg-slate-700"
            type="submit"
          >
            Check!
          </button>
        </form>
      </div>
      <div className="flex justify-center items-center font-mono mb-40">
        {isLoading ? (
          <LoaderPulse />
        ) : data ? (
          <div className="mx-10 w-2/3 bg-white bg-opacity-5 rounded-md px-5 py-20">
            {data["status-code"] === 10 ? (
              <div
                ref={myRef}
                className="flex flex-col justify-center items-center space-y-10 text-center"
              >
                <span className="text-amber-300 text-3xl font-bold">
                  Phishing Percentage: {data["phish_percent"]}
                </span>
                <div className="w-1/3 mx-auto opacity-60">
                  <PieChart
                    data={[
                      {
                        title: "Safe",
                        value: 100 - data["phish_percent"],
                        color: "#47B39C",
                      },
                      {
                        title: "Phishing",
                        value: data["phish_percent"],
                        color: "#EC6B56",
                      },
                    ]}
                    animate
                    animationDuration={500}
                    animationEasing="ease-out"
                    center={[50, 50]}
                    lengthAngle={360}
                    lineWidth={25}
                    paddingAngle={0}
                    radius={50}
                    rounded
                    startAngle={0}
                    viewBoxSize={[100, 100]}
                  />
                </div>
                <ul className="text-amber-300 list-inside list-disc text-justify tracking-widest">
                  <div className="font-bold text-lg underline">Summary:</div>
                  {data.summary.map((point: string) => (
                    <li className="hover:list-none hover:text-amber-600 transform transition-all mt-2">
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <span className="text-amber-300 font-mono font-bold flex justify-center">
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faTriangleExclamation}
                />
                {data.message}
              </span>
            )}
          </div>
        ) : (
          <div className="mx-10 w-2/3 bg-white bg-opacity-5 rounded-md p-5 text-center">
            <span className="text-amber-300 font-mono font-bold ">
              {
                "Welcome! Please enter a valid url (along with 'https://' or 'http://') to check the website for phishing."
              }
            </span>
          </div>
        )}
      </div>
      <footer className="text-amber-300 text-sm font-mono flex flex-col justify-center items-center space-y-2 text-center fixed bottom-0 right-0 left-0 py-5">
        <span className="bg-white bg-opacity-20 p-5">
          <a
            href=":LinkHere"
            className="underline hover:no-underline hover:text-amber-700"
          >
            GITHUB
          </a>
          <p className="font-bold">
            Websites checked for phishing till now: {count}
          </p>
          <p className="text-sm">Created by Priyanshu Upadhyay :)</p>
        </span>
      </footer>
    </>
  );
};

export default App;
