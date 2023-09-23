import { Loader } from "@mantine/core";

const centeredContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
};

export default function LoaderComponent() {
  return (
    <div style={centeredContainerStyle}>
      <Loader variant="bars" />
    </div>
  );
}
