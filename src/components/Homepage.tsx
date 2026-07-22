import Header from "./Header";
import Logo from "./Logo";
import Workingonit from "./workingonit";
import CollegeName from "./collegeName";

export default function Homepage() {
  return (
    <>
      <Header />
      <div
        className="app-container"
        style={{
          flexDirection: "column",
          paddingTop: "64px",
          position: "relative",
          height: "calc(100vh - 64px)",
        }}
      >
        <CollegeName />

        <Workingonit />
        <Logo />
      </div>
    </>
  );
}
