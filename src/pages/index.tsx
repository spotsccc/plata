import { allSettled, fork, serialize } from "effector";
import { GetServerSidePropsContext } from "next";
import { MainPage, pageStarted } from "~/client/pages/main";
import { mainPageController } from "~/server/page-controllers/main";

export default MainPage;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const data = await mainPageController(ctx.req);

  if (data.tag === "unauthorized") {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  const scope = fork();

  allSettled(pageStarted, { scope });

  return {
    props: {
      values: serialize(scope),
    },
  };
}
