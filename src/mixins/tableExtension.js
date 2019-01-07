import SkynetColumnTip from "@/components/ColumnTip";
import { Progress } from "iview";

export default {
  components: {
    SkynetColumnTip,
    Progress
  },
  methods: {
    renderColumn(h, { row, column }) {
      return <SkynetColumnTip title={row[column.key]} />;
    }
  }
};
