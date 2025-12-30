import streamlit as st
import pandas as pd
from io import StringIO
from pathlib import Path
import time

# Import renderer
try:
    from map_renderer import render_map
except ImportError:
    st.error("Error: 'map_renderer.py' not found.")
    def render_map(**kwargs): pass

# =============================
# 1. PAGE CONFIG & STYLING
# =============================
st.set_page_config(
    page_title="India Map Studio",
    page_icon="🗺️",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.markdown("""
<style>
/* Main container */
.block-container {padding-top: 2rem;}

/* Headings */
h1 {font-size: 2.5rem !important; color: #333;}

/* Buttons */
.stButton>button {width: 100%; border-radius: 5px; height: 3em;}
.stDownloadButton>button {width: 100%; border-radius: 5px;}

/* 🔹 Sidebar width */
section[data-testid="stSidebar"] {
    width: 340px !important;
}
</style>
""", unsafe_allow_html=True)

# =============================
# 2. HELPERS
# =============================
def load_sample_data():
    sample_csv = """state,value
Rajasthan,55
Kerala,12
Maharashtra,34
Uttar Pradesh,67
Tamil Nadu,22
Gujarat,45
West Bengal,30"""
    st.session_state["data_df"] = pd.read_csv(StringIO(sample_csv))

# Init session state
if "data_df" not in st.session_state:
    st.session_state["data_df"] = None

if "generated_map_path" not in st.session_state:
    st.session_state["generated_map_path"] = None

# =============================
# 3. SIDEBAR – CONTROLS
# =============================
with st.sidebar:
    st.markdown("### ⚙️ Map Settings")

    with st.expander("📝 Text & Labels", expanded=True):
        title_text = st.text_input(
            "Map Title",
            ""
        )
        source_text = st.text_input(
            "Source",
            ""
        )
        credits_text = st.text_input(   # ← ONLY ADDITION
            "Credits (optional)",
            ""
        )
        annotation_text = st.text_area(
            "Annotation",
            placeholder="Optional notes here…",
            height=100
        )

    with st.expander("🎨 Styling", expanded=True):
        palette = st.selectbox(
            "Color Palette",
            [
                "Blues", "Reds", "Greens", "Purples", "OrRd",
                "RdBu", "PiYG", "magma", "RdYlBu",
                "bwr", "coolwarm", "winter"
            ],
            index=0
        )
        col1, col2 = st.columns(2)
        with col1:
            value_prefix = st.text_input("Prefix", "")
        with col2:
            value_suffix = st.text_input("Suffix", "")

    st.markdown("---")
    st.info("💡 Excel / Google Sheets copy-paste is supported.")

# =============================
# 4. MAIN LAYOUT
# =============================
st.title("Map Studio by Vijay Jadhav")
st.markdown("Generate high-quality, publication-ready maps from your data.")

col_left, col_right = st.columns([1, 1.2], gap="large")

# =============================
# LEFT COLUMN – DATA INPUT
# =============================
with col_left:
    st.subheader("1. Data Input")

    input_method = st.radio(
        "Choose input method:",
        ["Upload CSV", "Paste CSV / Excel", "Use Sample"],
        horizontal=True
    )

    # -------- Upload CSV --------
    if input_method == "Upload CSV":
        uploaded_file = st.file_uploader(
            "Upload CSV (Columns: state, value)",
            type=["csv"]
        )
        if uploaded_file:
            df = pd.read_csv(uploaded_file)
            df.columns = df.columns.str.strip().str.lower()
            st.session_state["data_df"] = df

    # -------- Paste CSV / Excel --------
    elif input_method == "Paste CSV / Excel":
        csv_text = st.text_area(
            "Paste data here (CSV, Excel, or Google Sheets)",
            height=200,
            placeholder="state    value\nJammu & Kashmir    91.8\nHimachal Pradesh   63.7"
        )

        if csv_text.strip():
            try:
                df = pd.read_csv(StringIO(csv_text))
                if df.shape[1] == 1:
                    raise ValueError
            except:
                try:
                    df = pd.read_csv(StringIO(csv_text), sep="\t")
                    if df.shape[1] == 1:
                        raise ValueError
                except:
                    df = pd.read_fwf(StringIO(csv_text))

            df.columns = (
                df.columns
                .astype(str)
                .str.strip()
                .str.lower()
                .str.replace("\u00a0", "", regex=False)
            )

            st.session_state["data_df"] = df

    # -------- Sample Data --------
    elif input_method == "Use Sample":
        if st.button("Load Sample Data"):
            load_sample_data()
            st.rerun()

    # -------- Data Editor --------
    if st.session_state["data_df"] is not None:
        st.write("👇 **Edit data directly below:**")

        edited_df = st.data_editor(
            st.session_state["data_df"],
            num_rows="dynamic",
            use_container_width=True
        )

        required_cols = {"state", "value"}
        if not required_cols.issubset(edited_df.columns):
            st.error("Data must contain columns: state, value")
            ready_to_generate = False
        else:
            ready_to_generate = True
    else:
        st.info("Awaiting data…")
        ready_to_generate = False

    st.markdown("---")

    # -------- Generate Button --------
    if st.button("🚀 Generate Map", type="primary", disabled=not ready_to_generate):
        with st.spinner("Rendering map…"):
            output_dir = Path("output")
            output_dir.mkdir(exist_ok=True)

            temp_csv = output_dir / "ui_data.csv"
            output_path = output_dir / f"india_map_{int(time.time())}.png"

            edited_df.to_csv(temp_csv, index=False)

            try:
                render_map(
                    data_csv_path=str(temp_csv),
                    title_text=title_text,
                    source_text=source_text,
                    credits_text=credits_text,   # ← ONLY ADDITION
                    value_prefix=value_prefix,
                    value_suffix=value_suffix,
                    palette=palette,
                    annotation_text=annotation_text,
                    output_path=str(output_path)
                )

                st.session_state["generated_map_path"] = str(output_path)
                st.toast("Map generated successfully!", icon="✅")

            except Exception as e:
                st.error(f"Error generating map: {e}")

# =============================
# RIGHT COLUMN – PREVIEW
# =============================
with col_right:
    st.subheader("2. Preview & Download")

    if (
        st.session_state["generated_map_path"]
        and Path(st.session_state["generated_map_path"]).exists()
    ):
        st.image(
            st.session_state["generated_map_path"],
            caption=title_text,
            use_container_width=True
        )

        with open(st.session_state["generated_map_path"], "rb") as f:
            st.download_button(
                "📥 Download High-Res Image",
                data=f,
                file_name="india_choropleth.png",
                mime="image/png"
            )
    else:
        st.container(border=True).markdown(
            """
            <div style="text-align:center; padding:50px; color:#888;">
                <h3>No map generated yet</h3>
                <p>Add data and click Generate.</p>
            </div>
            """,
            unsafe_allow_html=True
        )

# =============================
# FOOTER
# =============================
st.markdown(
    'Built by <a href="https://www.linkedin.com/in/vijay-jay-jadhav/" target="_blank">Vijay Jadhav</a> '
    'with Python · Streamlit · GeoPandas · Matplotlib',
    unsafe_allow_html=True
)
