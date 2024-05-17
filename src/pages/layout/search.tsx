import { Icon } from "@/element/icon";
import { useState } from "react";
import { useIntl } from "react-intl";
import { useParams, useNavigate } from "react-router-dom";

export function SearchBar() {
  const { term } = useParams();
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [search, setSearch] = useState(term ?? "");

  return (
    <div className="pr-4 h-fit flex items-center rounded-full px-3 py-1 lg:border lg:border-layer-2">
      <input
        type="text"
        className="reset max-lg:hidden bg-transparent"
        placeholder={formatMessage({
          defaultMessage: "Search",
          id: "xmcVZ0",
        })}
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Enter") {
            navigate(`/search/${encodeURIComponent(search)}`);
          }
        }}
      />
      <Icon
        name="search"
        className="max-lg:text-black lg:text-layer-4 max-lg:ml-4 max-lg:my-1"
        size={16}
        onClick={() => {
          navigate("/search");
        }}
      />
    </div>
  );
}
