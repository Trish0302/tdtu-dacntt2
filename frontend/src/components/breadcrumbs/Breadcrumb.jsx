import { useLocation, Link } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();

  let currentLink = "";

  console.log("okokok", location.pathname);
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="breadcrumbs flex">
      <div className="flex w-fit">
        <Link to="/" className="">
          Home
        </Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
        </svg>
      </div>

      {location.pathname
        .split("/")
        .filter((crumb) => crumb !== "")
        .filter((crumb) => isNaN(crumb))
        .map((crumb, index) => {
          currentLink += `/${crumb}`;

          return (
            <>
              <div className="">
                {index ===
                location.pathname
                  .split("/")
                  .filter((crumb) => crumb !== "")
                  .filter((crumb) => isNaN(crumb)).length -
                  1 ? (
                  <div className="last-crumb" key={crumb}>
                    <Link to={currentLink}>
                      {capitalizeFirstLetter(crumb).replace(/-/g, " ")}
                    </Link>
                  </div>
                ) : (
                  <div className="crumb flex" key={crumb}>
                    <Link to={currentLink}>
                      {capitalizeFirstLetter(crumb).replace(/-/g, " ")}
                    </Link>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>
                    </svg>
                  </div>
                )}
              </div>
            </>
          );
        })}
    </div>
  );
};
export default Breadcrumb;
