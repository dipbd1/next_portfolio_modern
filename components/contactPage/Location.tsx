import MyInfo from "../MyInfo"

export default function Location() {
  return (
    <div className="p-12">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8897483954706!2d90.37587837594265!3d23.7513106887403!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8adf49f2b9f%3A0x429e45aba4c5e35b!2sBir%20Uttam%20Kazi%20Nuruzzaman%20Rd%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1691291134211!5m2!1sen!2sbd"
        style={{ border: 0 } as React.CSSProperties}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-96"
      ></iframe>
      <ul className="grid grid-cols-1 mt-10 location sm:grid-cols-2 gap-y-2">
        <MyInfo field="address" value="Dhaka, Bangladesh" />
        <MyInfo field="email" value="dipbd1@gmail.com" />
        <MyInfo field="phone" value="+880 168 5117737" />
        <MyInfo field="freelance" value="Not Available" />
      </ul>
    </div>
  )
}


