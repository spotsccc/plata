async function createDroplet() {
  const client = "";

  const res = await fetch("https://api.digitalocean.com/v2/droplets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${client}`,
    },
    body: JSON.stringify({
      name: "example.com",
      region: "nyc3",
      size: "s-1vcpu-1gb",
      image: "ubuntu-20-04-x64",
      backups: true,
      ipv6: true,
      monitoring: true,
    }),
  });
  console.log(res);
  console.log(await res.json());
}

createDroplet();
