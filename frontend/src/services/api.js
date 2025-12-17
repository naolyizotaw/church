export const fetchAnnouncements = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          title: 'Weekly Sunday Service',
          date: '2024-08-25',
          content: 'Join us for a time of powerful worship and teaching.',
          time: '10:00 AM - 12:00 PM',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBuIS2vPVy5MPJSp6oiByMR0NwwZbPze0IOvVQR--0TKJxIbN0W6zPfgR_tA1Pgmk4D9d-4WypaKY0J7WISLZcdKGcQJyLLnlkWTNqhKPvll-P5o2x4OtrVwvJMjGU0HpNqfQGpdFFvjDnPQgOruuZN-C3iC2RK7_q_M8i2LepZ93uWmiYRUqxqH1W3qEqyVvMvkroOZ45ciJmLhpIy7BmsH744n4v8PcVPFAcnn8ZscXlG4kz33RetOT8veF-qDqQE5MmJ9Gwqjc',
          month: 'AUG',
          day: '25',
        },
        {
          id: 2,
          title: 'Youth Fellowship Night',
          date: '2024-09-02',
          content: 'A gathering for young people to connect, grow, and have fun.',
          time: '4:00 PM - 6:00 PM',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVbc6UsQx82s1K_V0X6NXGE2S3Xc54J5exiK5erZu4nGMepih5BelrQ4xKzjK31C7uGi_jl8n4jtb9u6hQT7gxRR1KVc6bftBhGQViEJKXaEApXVZR8kPpjzNrsBSKY4CSGGhcsYDoHCd6tOgdbil0W5nro4GJwHJjvzI-5pvE0wUMtP_3WqCcn7-5_A1K1tfKmT3zSCTda9r4i69BepWSWxzVRgHYgF9dT_ye0f97nzyfC4rJj24U8YAjoaWKMz9ePq4VK2cMnbg',
          month: 'SEP',
          day: '02',
        },
        {
          id: 3,
          title: 'Community Outreach',
          date: '2024-09-15',
          content: 'Serving our local community through food distribution.',
          time: '9:00 AM - 1:00 PM',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd55X52V4JafSBNKLnnPBY7kez2XW8KA3ydvjN2JYHYDZJ8gIRtznwwQjNWsBVBYGzkhc2XYM8BJjthBzmfIaxXYLzGyKwPyzz7T4C_CwDOJsRVeXhLD24DNKUWGP1QXkaXdnlVAZ5qR6QzWPe7FPO0IM2znLdnnsWDSQuhe-a7979aPhTG2xGgPnvLvrYH862zM4Gp93qYf7qbGz6IyM8cC3fWgv-sm78fCwqgcHAz3dKH5GZPjOc9K_R8yLYqgbfoMC_WIyXZXQ',
          month: 'SEP',
          day: '15',
        },
      ]);
    }, 1000);
  });
};
